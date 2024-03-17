// import JSONbig from "json-bigint";

import { ethers } from "ethers";
import { toast } from "react-toastify";
import { createFlow, convertEthersContractCallResult } from "hyperdapp";

// const JSON_bigint = JSONbig({ useNativeBigInt: true, alwaysParseAsBig: true });

export type Flow = Awaited<ReturnType<typeof makeFlow>>;

export async function makeFlow(code: string): Promise<any> {
  return createFlow(code, {
    async onCallFn({
      block,
      env,
      contractAddress,
      functionSig,
      paramTypes,
      args,
      returnType,
      value,
      mutability,
    }: any) {
      const cacheKey =
        functionSig +
        (paramTypes.length === 0
          ? ""
          : ethers.utils.defaultAbiCoder.encode(paramTypes, args));

      // TODO: Handle more cases
      if (mutability.view && block.cache[cacheKey]) {
        console.log("[call_fn] (cache hit)", functionSig, contractAddress);
        return block.cache[cacheKey];
      }

      console.log(
        "[call_fn]",
        functionSig,
        value,
        args,
        block,
        contractAddress
      );

      const returns = returnType.length
        ? ` ${mutability.view || mutability.pure ? "view " : ""}returns ${
            returnType[0].startsWith("tuple(")
              ? returnType[0].replace(/^tuple/, "")
              : `(${returnType.join(",")})`
          }`
        : "";

      const fragment = `function ${functionSig}${
        mutability.payable ? " payable" : ""
      }${returns}`;

      const iface = new ethers.utils.Interface([fragment]);

      const contract = new ethers.Contract(
        contractAddress,
        iface,
        env.provider
      );

      const result = await contract
        .connect(env.signer)
        .functions[functionSig](...args, { value: value })
        .then(
          (result) => {
            if (Array.isArray(result)) {
              return result?.map(convertEthersContractCallResult);
            } else if (result && result.wait) {
              toast.info("Waiting on transaction...", {
                autoClose: false,
                theme: "colored",
              });
              return result.wait().then(
                function onSuccess() {
                  toast.dismiss();
                  toast.success("Transaction successful!", {
                    theme: "colored",
                  });
                  return [];
                },
                function onError(error: any) {
                  toast.dismiss();
                  toast.error(`Transaction failed. ${error.message}`, {
                    theme: "colored",
                  });
                }
              );
            } else {
              return result;
            }
          },
          (error) => {
            const message =
              error?.data?.message || error?.message || "An error occurred.";
            toast.dismiss();
            toast.error(message, { theme: "colored" });
            throw error;
          }
        );

      if (result !== undefined) {
        block.cache[cacheKey] = result;
      }

      console.log("[call_fn] Returned:", result);

      return result;
    },

    async onCallHttp({ method, url, cache }: any) {
      // Currently only support GET requests
      if (method !== "GET") {
        console.error("[call_http] Only GET calls are currently supported");
        throw new Error("http_non_get");
      }

      if (cache[url]) {
        console.log("[call_http] GET (cache hit)", url);
        return cache[url];
      }
      console.log("[call_http] GET", url);

      const res = await fetch(url);
      const body = await res.text();
      let json: any = undefined;

      try {
        json = JSON.parse(body);
        console.log("[call_http] Result:", json);
      } catch {
        console.log("[call_http] Failed to parse:", body);
        json = undefined;
      }
      const result = [
        res.status,
        // @ts-ignore
        Object.fromEntries(res.headers.entries()),
        json,
      ];

      if (json) {
        cache[url] = result;
      }

      return result;
    },
  });
}
