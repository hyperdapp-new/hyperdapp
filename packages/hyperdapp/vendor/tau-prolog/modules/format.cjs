/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   Originally written by Markus Triska (triska@metalevel.at)
   as part of Scryer Prolog:

   https://github.com/mthom/scryer-prolog/blob/master/src/prolog/lib/format.pl

   This library provides the nonterminal format_//2 to describe
   formatted strings. format/2 is provided for impure output.

   Usage:
   ======

   phrase(format_(FormatString, Arguments), Ls)

   format_//2 describes a list of characters Ls that are formatted
   according to FormatString. FormatString is a string (i.e.,
   a list of characters) that specifies the layout of Ls.
   The characters in FormatString are used literally, except
   for the following tokens with special meaning:

     ~w    use the next available argument from Arguments here
     ~q    use the next argument here, formatted as by writeq/1
     ~a    use the next argument here, which must be an atom
     ~s    use the next argument here, which must be a string
     ~d    use the next argument here, which must be an integer
     ~f    use the next argument here, a floating point number
     ~Nf   where N is an integer: format the float argument
           using N digits after the decimal point
     ~Nd   like ~d, placing the last N digits after a decimal point;
           if N is 0 or omitted, no decimal point is used.
     ~ND   like ~Nd, separating digits to the left of the decimal point
           in groups of three, using the character "," (comma)
     ~Nr   where N is an integer between 2 and 36: format the
           next argument, which must be an integer, in radix N.
           The characters "a" to "z" are used for radices 10 to 36.
     ~NR   like ~Nr, except that "A" to "Z" are used for radices > 9
     ~|    place a tab stop at this position
     ~N|   where N is an integer: place a tab stop at text column N
     ~N+   where N is an integer: place a tab stop N characters
           after the previous tab stop (or start of line)
     ~t    distribute spaces evenly between the two closest tab stops
     ~`Ct  like ~t, use character C instead of spaces to fill the space
     ~n    newline
     ~Nn   N newlines
     ~i    ignore the next argument
     ~~    the literal ~

   Instead of ~N, you can write ~* to use the next argument from Arguments
   as the numeric argument.

   The predicate format/2 is like format_//2, except that it outputs
   the text on the terminal instead of describing it declaratively.

   If at all possible, format_//2 should be used, to stress pure parts
   that enable easy testing etc. If necessary, you can emit the list Ls
   with maplist(write, Ls).

   The entire library only works if the Prolog flag double_quotes
   is set to chars, the default value in Scryer Prolog. This should
   also stay that way, to encourage a sensible environment.

   Example:

   ?- phrase(format_("~s~n~`.t~w!~12|", ["hello",there]), Cs).
   %@    Cs = "hello\n......there!"
   %@ ;  false.

   I place this code in the public domain. Use it in any way you want.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default function (pl) {
  var name = "format";
  var predicates = function () {
    return {
      "format_/4": [
        new pl.type.Rule(
          new pl.type.Term("format_", [
            new pl.type.Var("_1"),
            new pl.type.Var("_2"),
            new pl.type.Var("_4"),
            new pl.type.Var("_6"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term(";", [
                  new pl.type.Term("->", [
                    new pl.type.Term("is_list", [new pl.type.Var("_1")]),
                    new pl.type.Term("true", []),
                  ]),
                  new pl.type.Term("throw", [
                    new pl.type.Term("error", [
                      new pl.type.Term("type_error", [
                        new pl.type.Term("list", []),
                        new pl.type.Var("_1"),
                      ]),
                      new pl.type.Term("/", [
                        new pl.type.Term("format_", []),
                        new pl.type.Num(2, false),
                      ]),
                    ]),
                  ]),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term(";", [
                    new pl.type.Term("->", [
                      new pl.type.Term("is_list", [new pl.type.Var("_2")]),
                      new pl.type.Term("true", []),
                    ]),
                    new pl.type.Term("throw", [
                      new pl.type.Term("error", [
                        new pl.type.Term("type_error", [
                          new pl.type.Term("list", []),
                          new pl.type.Var("_2"),
                        ]),
                        new pl.type.Term("/", [
                          new pl.type.Term("format_", []),
                          new pl.type.Num(2, false),
                        ]),
                      ]),
                    ]),
                  ]),
                  new pl.type.Term("phrase", [
                    new pl.type.Term("cells", [
                      new pl.type.Var("_1"),
                      new pl.type.Var("_2"),
                      new pl.type.Num(0, false),
                      new pl.type.Term("[]", []),
                    ]),
                    new pl.type.Var("_3"),
                  ]),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_4"),
                new pl.type.Var("_5"),
              ]),
            ]),
            new pl.type.Term("format_cells", [
              new pl.type.Var("_3"),
              new pl.type.Var("_5"),
              new pl.type.Var("_6"),
            ]),
          ])
        ),
      ],
      "format_cells/3": [
        new pl.type.Rule(
          new pl.type.Term("format_cells", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_7"),
            new pl.type.Var("_7"),
          ]),
          new pl.type.Term("true", [])
        ),
        new pl.type.Rule(
          new pl.type.Term("format_cells", [
            new pl.type.Term(".", [
              new pl.type.Var("_8"),
              new pl.type.Var("_3"),
            ]),
            new pl.type.Var("_9"),
            new pl.type.Var("_11"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("format_cell", [
              new pl.type.Var("_8"),
              new pl.type.Var("_9"),
              new pl.type.Var("_10"),
            ]),
            new pl.type.Term("format_cells", [
              new pl.type.Var("_3"),
              new pl.type.Var("_10"),
              new pl.type.Var("_11"),
            ]),
          ])
        ),
      ],
      "format_cell/3": [
        new pl.type.Rule(
          new pl.type.Term("format_cell", [
            new pl.type.Term("newline", []),
            new pl.type.Term(".", [
              new pl.type.Term("\n", []),
              new pl.type.Var("_13"),
            ]),
            new pl.type.Var("_13"),
          ]),
          null
        ),
        new pl.type.Rule(
          new pl.type.Term("format_cell", [
            new pl.type.Term("cell", [
              new pl.type.Var("_14"),
              new pl.type.Var("_15"),
              new pl.type.Var("_16"),
            ]),
            new pl.type.Var("_25"),
            new pl.type.Var("_27"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("phrase", [
                  new pl.type.Term("elements_gluevars", [
                    new pl.type.Var("_16"),
                    new pl.type.Num(0, false),
                    new pl.type.Var("_17"),
                  ]),
                  new pl.type.Var("_18"),
                ]),
                new pl.type.Term(";", [
                  new pl.type.Term("->", [
                    new pl.type.Term("=", [
                      new pl.type.Var("_18"),
                      new pl.type.Term("[]", []),
                    ]),
                    new pl.type.Term("true", []),
                  ]),
                  new pl.type.Term(",", [
                    new pl.type.Term("is", [
                      new pl.type.Var("_19"),
                      new pl.type.Term("-", [
                        new pl.type.Term("-", [
                          new pl.type.Var("_15"),
                          new pl.type.Var("_14"),
                        ]),
                        new pl.type.Var("_17"),
                      ]),
                    ]),
                    new pl.type.Term(";", [
                      new pl.type.Term("->", [
                        new pl.type.Term("=<", [
                          new pl.type.Var("_19"),
                          new pl.type.Num(0, false),
                        ]),
                        new pl.type.Term("maplist", [
                          new pl.type.Term("=", [new pl.type.Num(0, false)]),
                          new pl.type.Var("_18"),
                        ]),
                      ]),
                      new pl.type.Term(",", [
                        new pl.type.Term("length", [
                          new pl.type.Var("_18"),
                          new pl.type.Var("_20"),
                        ]),
                        new pl.type.Term(",", [
                          new pl.type.Term("is", [
                            new pl.type.Var("_21"),
                            new pl.type.Term("//", [
                              new pl.type.Var("_19"),
                              new pl.type.Var("_20"),
                            ]),
                          ]),
                          new pl.type.Term(",", [
                            new pl.type.Term("is", [
                              new pl.type.Var("_22"),
                              new pl.type.Term("-", [
                                new pl.type.Var("_19"),
                                new pl.type.Term("*", [
                                  new pl.type.Var("_21"),
                                  new pl.type.Var("_20"),
                                ]),
                              ]),
                            ]),
                            new pl.type.Term(";", [
                              new pl.type.Term("->", [
                                new pl.type.Term("=:=", [
                                  new pl.type.Var("_22"),
                                  new pl.type.Num(0, false),
                                ]),
                                new pl.type.Term("maplist", [
                                  new pl.type.Term("=", [
                                    new pl.type.Var("_21"),
                                  ]),
                                  new pl.type.Var("_18"),
                                ]),
                              ]),
                              new pl.type.Term(",", [
                                new pl.type.Term("is", [
                                  new pl.type.Var("_23"),
                                  new pl.type.Term("+", [
                                    new pl.type.Var("_21"),
                                    new pl.type.Var("_22"),
                                  ]),
                                ]),
                                new pl.type.Term(",", [
                                  new pl.type.Term("reverse", [
                                    new pl.type.Var("_18"),
                                    new pl.type.Term(".", [
                                      new pl.type.Var("_23"),
                                      new pl.type.Var("_24"),
                                    ]),
                                  ]),
                                  new pl.type.Term("maplist", [
                                    new pl.type.Term("=", [
                                      new pl.type.Var("_21"),
                                    ]),
                                    new pl.type.Var("_24"),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_25"),
                new pl.type.Var("_26"),
              ]),
            ]),
            new pl.type.Term("format_elements", [
              new pl.type.Var("_16"),
              new pl.type.Var("_26"),
              new pl.type.Var("_27"),
            ]),
          ])
        ),
      ],
      "format_elements/3": [
        new pl.type.Rule(
          new pl.type.Term("format_elements", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_28"),
            new pl.type.Var("_28"),
          ]),
          new pl.type.Term("true", [])
        ),
        new pl.type.Rule(
          new pl.type.Term("format_elements", [
            new pl.type.Term(".", [
              new pl.type.Var("_29"),
              new pl.type.Var("_16"),
            ]),
            new pl.type.Var("_30"),
            new pl.type.Var("_32"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("format_element", [
              new pl.type.Var("_29"),
              new pl.type.Var("_30"),
              new pl.type.Var("_31"),
            ]),
            new pl.type.Term("format_elements", [
              new pl.type.Var("_16"),
              new pl.type.Var("_31"),
              new pl.type.Var("_32"),
            ]),
          ])
        ),
      ],
      "format_element/3": [
        new pl.type.Rule(
          new pl.type.Term("format_element", [
            new pl.type.Term("chars", [new pl.type.Var("_33")]),
            new pl.type.Var("_34"),
            new pl.type.Var("_35"),
          ]),
          new pl.type.Term("list", [
            new pl.type.Var("_33"),
            new pl.type.Var("_34"),
            new pl.type.Var("_35"),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("format_element", [
            new pl.type.Term("glue", [
              new pl.type.Var("_36"),
              new pl.type.Var("_37"),
            ]),
            new pl.type.Var("_39"),
            new pl.type.Var("_41"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("length", [
                  new pl.type.Var("_38"),
                  new pl.type.Var("_37"),
                ]),
                new pl.type.Term("maplist", [
                  new pl.type.Term("=", [new pl.type.Var("_36")]),
                  new pl.type.Var("_38"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_39"),
                new pl.type.Var("_40"),
              ]),
            ]),
            new pl.type.Term("list", [
              new pl.type.Var("_38"),
              new pl.type.Var("_40"),
              new pl.type.Var("_41"),
            ]),
          ])
        ),
      ],
      "list/3": [
        new pl.type.Rule(
          new pl.type.Term("list", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_42"),
            new pl.type.Var("_42"),
          ]),
          new pl.type.Term("true", [])
        ),
        new pl.type.Rule(
          new pl.type.Term("list", [
            new pl.type.Term(".", [
              new pl.type.Var("_43"),
              new pl.type.Var("_38"),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_43"),
              new pl.type.Var("_45"),
            ]),
            new pl.type.Var("_46"),
          ]),
          new pl.type.Term("list", [
            new pl.type.Var("_38"),
            new pl.type.Var("_45"),
            new pl.type.Var("_46"),
          ])
        ),
      ],
      "elements_gluevars/5": [
        new pl.type.Rule(
          new pl.type.Term("elements_gluevars", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_47"),
            new pl.type.Var("_47"),
            new pl.type.Var("_48"),
            new pl.type.Var("_48"),
          ]),
          new pl.type.Term("true", [])
        ),
        new pl.type.Rule(
          new pl.type.Term("elements_gluevars", [
            new pl.type.Term(".", [
              new pl.type.Var("_29"),
              new pl.type.Var("_16"),
            ]),
            new pl.type.Var("_49"),
            new pl.type.Var("_47"),
            new pl.type.Var("_51"),
            new pl.type.Var("_53"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("element_gluevar", [
              new pl.type.Var("_29"),
              new pl.type.Var("_49"),
              new pl.type.Var("_50"),
              new pl.type.Var("_51"),
              new pl.type.Var("_52"),
            ]),
            new pl.type.Term("elements_gluevars", [
              new pl.type.Var("_16"),
              new pl.type.Var("_50"),
              new pl.type.Var("_47"),
              new pl.type.Var("_52"),
              new pl.type.Var("_53"),
            ]),
          ])
        ),
      ],
      "element_gluevar/5": [
        new pl.type.Rule(
          new pl.type.Term("element_gluevar", [
            new pl.type.Term("chars", [new pl.type.Var("_33")]),
            new pl.type.Var("_49"),
            new pl.type.Var("_47"),
            new pl.type.Var("_54"),
            new pl.type.Var("_55"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("length", [
                new pl.type.Var("_33"),
                new pl.type.Var("_43"),
              ]),
              new pl.type.Term("is", [
                new pl.type.Var("_47"),
                new pl.type.Term("+", [
                  new pl.type.Var("_49"),
                  new pl.type.Var("_43"),
                ]),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_54"),
              new pl.type.Var("_55"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("element_gluevar", [
            new pl.type.Term("glue", [
              new pl.type.Var("_56"),
              new pl.type.Var("_57"),
            ]),
            new pl.type.Var("_47"),
            new pl.type.Var("_47"),
            new pl.type.Term(".", [
              new pl.type.Var("_57"),
              new pl.type.Var("_59"),
            ]),
            new pl.type.Var("_59"),
          ]),
          null
        ),
      ],
      "cells/6": [
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_61"),
            new pl.type.Var("_64"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(";", [
              new pl.type.Term("->", [
                new pl.type.Term(",", [
                  new pl.type.Term("==", [
                    new pl.type.Var("_2"),
                    new pl.type.Term("[]", []),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_61"),
                    new pl.type.Var("_62"),
                  ]),
                ]),
                new pl.type.Term("cell", [
                  new pl.type.Var("_60"),
                  new pl.type.Var("_60"),
                  new pl.type.Var("_16"),
                  new pl.type.Var("_62"),
                  new pl.type.Var("_63"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("throw", [
                  new pl.type.Term("error", [
                    new pl.type.Term("domain_error", [
                      new pl.type.Term("no_remaining_arguments", []),
                      new pl.type.Var("_2"),
                    ]),
                    new pl.type.Term("/", [
                      new pl.type.Term("format_", []),
                      new pl.type.Num(2, false),
                    ]),
                  ]),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_61"),
                  new pl.type.Var("_64"),
                ]),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_63"),
              new pl.type.Var("_64"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("~", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_65"),
            new pl.type.Var("_67"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_65"),
                new pl.type.Var("_66"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Term(".", [
                new pl.type.Term("chars", [
                  new pl.type.Term(".", [
                    new pl.type.Term("~", []),
                    new pl.type.Term("[]", []),
                  ]),
                ]),
                new pl.type.Var("_16"),
              ]),
              new pl.type.Var("_66"),
              new pl.type.Var("_67"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("w", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_68"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_70"),
            new pl.type.Var("_73"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_70"),
                new pl.type.Var("_71"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("write_term_to_chars", [
                  new pl.type.Var("_68"),
                  new pl.type.Term("[]", []),
                  new pl.type.Var("_69"),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_71"),
                  new pl.type.Var("_72"),
                ]),
              ]),
              new pl.type.Term("cells", [
                new pl.type.Var("_1"),
                new pl.type.Var("_2"),
                new pl.type.Var("_60"),
                new pl.type.Term(".", [
                  new pl.type.Term("chars", [new pl.type.Var("_69")]),
                  new pl.type.Var("_16"),
                ]),
                new pl.type.Var("_72"),
                new pl.type.Var("_73"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("q", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_68"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_74"),
            new pl.type.Var("_77"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_74"),
                new pl.type.Var("_75"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("write_term_to_chars", [
                  new pl.type.Var("_68"),
                  new pl.type.Term(".", [
                    new pl.type.Term("quoted", [new pl.type.Term("true", [])]),
                    new pl.type.Term("[]", []),
                  ]),
                  new pl.type.Var("_69"),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_75"),
                  new pl.type.Var("_76"),
                ]),
              ]),
              new pl.type.Term("cells", [
                new pl.type.Var("_1"),
                new pl.type.Var("_2"),
                new pl.type.Var("_60"),
                new pl.type.Term(".", [
                  new pl.type.Term("chars", [new pl.type.Var("_69")]),
                  new pl.type.Var("_16"),
                ]),
                new pl.type.Var("_76"),
                new pl.type.Var("_77"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("a", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_68"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_78"),
            new pl.type.Var("_81"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_78"),
                new pl.type.Var("_79"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("atom_chars", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_69"),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_79"),
                  new pl.type.Var("_80"),
                ]),
              ]),
              new pl.type.Term("cells", [
                new pl.type.Var("_1"),
                new pl.type.Var("_2"),
                new pl.type.Var("_60"),
                new pl.type.Term(".", [
                  new pl.type.Term("chars", [new pl.type.Var("_69")]),
                  new pl.type.Var("_16"),
                ]),
                new pl.type.Var("_80"),
                new pl.type.Var("_81"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_89"),
            new pl.type.Var("_96"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("d", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Term(".", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_2"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_89"),
                new pl.type.Var("_90"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_90"),
                  new pl.type.Var("_91"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term("number_chars", [
                    new pl.type.Var("_68"),
                    new pl.type.Var("_84"),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_91"),
                    new pl.type.Var("_92"),
                  ]),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term(",", [
                    new pl.type.Term(";", [
                      new pl.type.Term("->", [
                        new pl.type.Term(",", [
                          new pl.type.Term("=:=", [
                            new pl.type.Var("_37"),
                            new pl.type.Num(0, false),
                          ]),
                          new pl.type.Term("=", [
                            new pl.type.Var("_92"),
                            new pl.type.Var("_93"),
                          ]),
                        ]),
                        new pl.type.Term(",", [
                          new pl.type.Term("=", [
                            new pl.type.Var("_33"),
                            new pl.type.Var("_84"),
                          ]),
                          new pl.type.Term("=", [
                            new pl.type.Var("_93"),
                            new pl.type.Var("_94"),
                          ]),
                        ]),
                      ]),
                      new pl.type.Term(",", [
                        new pl.type.Term(",", [
                          new pl.type.Term("length", [
                            new pl.type.Var("_84"),
                            new pl.type.Var("_43"),
                          ]),
                          new pl.type.Term(";", [
                            new pl.type.Term("->", [
                              new pl.type.Term("=<", [
                                new pl.type.Var("_43"),
                                new pl.type.Var("_37"),
                              ]),
                              new pl.type.Term(",", [
                                new pl.type.Term("is", [
                                  new pl.type.Var("_22"),
                                  new pl.type.Term("-", [
                                    new pl.type.Var("_37"),
                                    new pl.type.Var("_43"),
                                  ]),
                                ]),
                                new pl.type.Term(",", [
                                  new pl.type.Term("length", [
                                    new pl.type.Var("_85"),
                                    new pl.type.Var("_22"),
                                  ]),
                                  new pl.type.Term(",", [
                                    new pl.type.Term("maplist", [
                                      new pl.type.Term("=", [
                                        new pl.type.Term("0", []),
                                      ]),
                                      new pl.type.Var("_85"),
                                    ]),
                                    new pl.type.Term("phrase", [
                                      new pl.type.Term(",", [
                                        new pl.type.Term(".", [
                                          new pl.type.Term("0", []),
                                          new pl.type.Term(".", [
                                            new pl.type.Term(".", []),
                                            new pl.type.Term("[]", []),
                                          ]),
                                        ]),
                                        new pl.type.Term(",", [
                                          new pl.type.Term("list", [
                                            new pl.type.Var("_85"),
                                          ]),
                                          new pl.type.Term("list", [
                                            new pl.type.Var("_84"),
                                          ]),
                                        ]),
                                      ]),
                                      new pl.type.Var("_33"),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                            new pl.type.Term(",", [
                              new pl.type.Term("is", [
                                new pl.type.Var("_86"),
                                new pl.type.Term("-", [
                                  new pl.type.Var("_43"),
                                  new pl.type.Var("_37"),
                                ]),
                              ]),
                              new pl.type.Term(",", [
                                new pl.type.Term("length", [
                                  new pl.type.Var("_87"),
                                  new pl.type.Var("_86"),
                                ]),
                                new pl.type.Term(",", [
                                  new pl.type.Term("append", [
                                    new pl.type.Var("_87"),
                                    new pl.type.Var("_88"),
                                    new pl.type.Var("_84"),
                                  ]),
                                  new pl.type.Term("phrase", [
                                    new pl.type.Term(",", [
                                      new pl.type.Term("list", [
                                        new pl.type.Var("_87"),
                                      ]),
                                      new pl.type.Term(",", [
                                        new pl.type.Term(".", [
                                          new pl.type.Term(".", []),
                                          new pl.type.Term("[]", []),
                                        ]),
                                        new pl.type.Term("list", [
                                          new pl.type.Var("_88"),
                                        ]),
                                      ]),
                                    ]),
                                    new pl.type.Var("_33"),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        new pl.type.Term("=", [
                          new pl.type.Var("_92"),
                          new pl.type.Var("_95"),
                        ]),
                      ]),
                    ]),
                    new pl.type.Term("=", [
                      new pl.type.Var("_94"),
                      new pl.type.Var("_95"),
                    ]),
                  ]),
                  new pl.type.Term("cells", [
                    new pl.type.Var("_1"),
                    new pl.type.Var("_2"),
                    new pl.type.Var("_60"),
                    new pl.type.Term(".", [
                      new pl.type.Term("chars", [new pl.type.Var("_33")]),
                      new pl.type.Var("_16"),
                    ]),
                    new pl.type.Var("_95"),
                    new pl.type.Var("_96"),
                  ]),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_102"),
            new pl.type.Var("_106"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("D", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Term(".", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_2"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_102"),
                new pl.type.Var("_103"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_103"),
                  new pl.type.Var("_104"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term(",", [
                    new pl.type.Term("number_chars", [
                      new pl.type.Var("_37"),
                      new pl.type.Var("_97"),
                    ]),
                    new pl.type.Term(",", [
                      new pl.type.Term("phrase", [
                        new pl.type.Term(",", [
                          new pl.type.Term(".", [
                            new pl.type.Term("~", []),
                            new pl.type.Term("[]", []),
                          ]),
                          new pl.type.Term(",", [
                            new pl.type.Term("list", [new pl.type.Var("_97")]),
                            new pl.type.Term(".", [
                              new pl.type.Term("d", []),
                              new pl.type.Term("[]", []),
                            ]),
                          ]),
                        ]),
                        new pl.type.Var("_98"),
                      ]),
                      new pl.type.Term(",", [
                        new pl.type.Term("phrase", [
                          new pl.type.Term("format_", [
                            new pl.type.Var("_98"),
                            new pl.type.Term(".", [
                              new pl.type.Var("_68"),
                              new pl.type.Term("[]", []),
                            ]),
                          ]),
                          new pl.type.Var("_84"),
                        ]),
                        new pl.type.Term(",", [
                          new pl.type.Term("phrase", [
                            new pl.type.Term("upto_what", [
                              new pl.type.Var("_99"),
                              new pl.type.Term(".", []),
                            ]),
                            new pl.type.Var("_84"),
                            new pl.type.Var("_88"),
                          ]),
                          new pl.type.Term(",", [
                            new pl.type.Term("reverse", [
                              new pl.type.Var("_99"),
                              new pl.type.Var("_100"),
                            ]),
                            new pl.type.Term(",", [
                              new pl.type.Term("phrase", [
                                new pl.type.Term("groups_of_three", [
                                  new pl.type.Var("_100"),
                                ]),
                                new pl.type.Var("_101"),
                              ]),
                              new pl.type.Term(",", [
                                new pl.type.Term("reverse", [
                                  new pl.type.Var("_101"),
                                  new pl.type.Var("_87"),
                                ]),
                                new pl.type.Term("append", [
                                  new pl.type.Var("_87"),
                                  new pl.type.Var("_88"),
                                  new pl.type.Var("_33"),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_104"),
                    new pl.type.Var("_105"),
                  ]),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Var("_60"),
                  new pl.type.Term(".", [
                    new pl.type.Term("chars", [new pl.type.Var("_33")]),
                    new pl.type.Var("_16"),
                  ]),
                  new pl.type.Var("_105"),
                  new pl.type.Var("_106"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("i", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_107"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_108"),
            new pl.type.Var("_110"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_108"),
                new pl.type.Var("_109"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Var("_16"),
              new pl.type.Var("_109"),
              new pl.type.Var("_110"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("n", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_111"),
            new pl.type.Var("_115"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_111"),
                new pl.type.Var("_112"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("cell", [
                new pl.type.Var("_60"),
                new pl.type.Var("_60"),
                new pl.type.Var("_16"),
                new pl.type.Var("_112"),
                new pl.type.Var("_113"),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("n_newlines", [
                  new pl.type.Num(1, false),
                  new pl.type.Var("_113"),
                  new pl.type.Var("_114"),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Num(0, false),
                  new pl.type.Term("[]", []),
                  new pl.type.Var("_114"),
                  new pl.type.Var("_115"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_116"),
            new pl.type.Var("_121"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("n", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Var("_2"),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_116"),
                new pl.type.Var("_117"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_117"),
                  new pl.type.Var("_118"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("cell", [
                  new pl.type.Var("_60"),
                  new pl.type.Var("_60"),
                  new pl.type.Var("_16"),
                  new pl.type.Var("_118"),
                  new pl.type.Var("_119"),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term("n_newlines", [
                    new pl.type.Var("_37"),
                    new pl.type.Var("_119"),
                    new pl.type.Var("_120"),
                  ]),
                  new pl.type.Term("cells", [
                    new pl.type.Var("_1"),
                    new pl.type.Var("_2"),
                    new pl.type.Num(0, false),
                    new pl.type.Term("[]", []),
                    new pl.type.Var("_120"),
                    new pl.type.Var("_121"),
                  ]),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("s", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_68"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_122"),
            new pl.type.Var("_124"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_122"),
                new pl.type.Var("_123"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Term(".", [
                new pl.type.Term("chars", [new pl.type.Var("_68")]),
                new pl.type.Var("_16"),
              ]),
              new pl.type.Var("_123"),
              new pl.type.Var("_124"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("f", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Term(".", [
              new pl.type.Var("_68"),
              new pl.type.Var("_2"),
            ]),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_125"),
            new pl.type.Var("_128"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_125"),
                new pl.type.Var("_126"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("number_chars", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_69"),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_126"),
                  new pl.type.Var("_127"),
                ]),
              ]),
              new pl.type.Term("cells", [
                new pl.type.Var("_1"),
                new pl.type.Var("_2"),
                new pl.type.Var("_60"),
                new pl.type.Term(".", [
                  new pl.type.Term("chars", [new pl.type.Var("_69")]),
                  new pl.type.Var("_16"),
                ]),
                new pl.type.Var("_127"),
                new pl.type.Var("_128"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_130"),
            new pl.type.Var("_134"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("f", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Term(".", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_2"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_130"),
                new pl.type.Var("_131"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_131"),
                  new pl.type.Var("_132"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term(",", [
                    new pl.type.Term("number_chars", [
                      new pl.type.Var("_68"),
                      new pl.type.Var("_84"),
                    ]),
                    new pl.type.Term(",", [
                      new pl.type.Term("phrase", [
                        new pl.type.Term("upto_what", [
                          new pl.type.Var("_87"),
                          new pl.type.Term(".", []),
                        ]),
                        new pl.type.Var("_84"),
                        new pl.type.Var("_33"),
                      ]),
                      new pl.type.Term(";", [
                        new pl.type.Term("->", [
                          new pl.type.Term("=:=", [
                            new pl.type.Var("_37"),
                            new pl.type.Num(0, false),
                          ]),
                          new pl.type.Term("=", [
                            new pl.type.Var("_69"),
                            new pl.type.Var("_87"),
                          ]),
                        ]),
                        new pl.type.Term(",", [
                          new pl.type.Term(";", [
                            new pl.type.Term("->", [
                              new pl.type.Term("=", [
                                new pl.type.Var("_33"),
                                new pl.type.Term(".", [
                                  new pl.type.Term(".", []),
                                  new pl.type.Var("_24"),
                                ]),
                              ]),
                              new pl.type.Term(",", [
                                new pl.type.Term("length", [
                                  new pl.type.Var("_24"),
                                  new pl.type.Var("_43"),
                                ]),
                                new pl.type.Term(";", [
                                  new pl.type.Term("->", [
                                    new pl.type.Term("<", [
                                      new pl.type.Var("_37"),
                                      new pl.type.Var("_43"),
                                    ]),
                                    new pl.type.Term(",", [
                                      new pl.type.Term("length", [
                                        new pl.type.Var("_88"),
                                        new pl.type.Var("_37"),
                                      ]),
                                      new pl.type.Term("append", [
                                        new pl.type.Var("_88"),
                                        new pl.type.Var("_129"),
                                        new pl.type.Var("_24"),
                                      ]),
                                    ]),
                                  ]),
                                  new pl.type.Term(";", [
                                    new pl.type.Term("->", [
                                      new pl.type.Term("=:=", [
                                        new pl.type.Var("_37"),
                                        new pl.type.Var("_43"),
                                      ]),
                                      new pl.type.Term("=", [
                                        new pl.type.Var("_88"),
                                        new pl.type.Var("_24"),
                                      ]),
                                    ]),
                                    new pl.type.Term(",", [
                                      new pl.type.Term(">", [
                                        new pl.type.Var("_37"),
                                        new pl.type.Var("_43"),
                                      ]),
                                      new pl.type.Term(",", [
                                        new pl.type.Term("is", [
                                          new pl.type.Var("_22"),
                                          new pl.type.Term("-", [
                                            new pl.type.Var("_37"),
                                            new pl.type.Var("_43"),
                                          ]),
                                        ]),
                                        new pl.type.Term(",", [
                                          new pl.type.Term("length", [
                                            new pl.type.Var("_85"),
                                            new pl.type.Var("_22"),
                                          ]),
                                          new pl.type.Term(",", [
                                            new pl.type.Term("maplist", [
                                              new pl.type.Term("=", [
                                                new pl.type.Term("0", []),
                                              ]),
                                              new pl.type.Var("_85"),
                                            ]),
                                            new pl.type.Term("append", [
                                              new pl.type.Var("_24"),
                                              new pl.type.Var("_85"),
                                              new pl.type.Var("_88"),
                                            ]),
                                          ]),
                                        ]),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                            new pl.type.Term(",", [
                              new pl.type.Term("length", [
                                new pl.type.Var("_88"),
                                new pl.type.Var("_37"),
                              ]),
                              new pl.type.Term("maplist", [
                                new pl.type.Term("=", [
                                  new pl.type.Term("0", []),
                                ]),
                                new pl.type.Var("_88"),
                              ]),
                            ]),
                          ]),
                          new pl.type.Term("append", [
                            new pl.type.Var("_87"),
                            new pl.type.Term(".", [
                              new pl.type.Term(".", []),
                              new pl.type.Var("_88"),
                            ]),
                            new pl.type.Var("_69"),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_132"),
                    new pl.type.Var("_133"),
                  ]),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Var("_60"),
                  new pl.type.Term(".", [
                    new pl.type.Term("chars", [new pl.type.Var("_69")]),
                    new pl.type.Var("_16"),
                  ]),
                  new pl.type.Var("_133"),
                  new pl.type.Var("_134"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_135"),
            new pl.type.Var("_139"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("r", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Term(".", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_2"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_135"),
                new pl.type.Var("_136"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_136"),
                  new pl.type.Var("_137"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term("integer_to_radix", [
                    new pl.type.Var("_68"),
                    new pl.type.Var("_37"),
                    new pl.type.Term("lowercase", []),
                    new pl.type.Var("_33"),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_137"),
                    new pl.type.Var("_138"),
                  ]),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Var("_60"),
                  new pl.type.Term(".", [
                    new pl.type.Term("chars", [new pl.type.Var("_33")]),
                    new pl.type.Var("_16"),
                  ]),
                  new pl.type.Var("_138"),
                  new pl.type.Var("_139"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_140"),
            new pl.type.Var("_144"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("R", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Term(".", [
                  new pl.type.Var("_68"),
                  new pl.type.Var("_2"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_140"),
                new pl.type.Var("_141"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_141"),
                  new pl.type.Var("_142"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term("integer_to_radix", [
                    new pl.type.Var("_68"),
                    new pl.type.Var("_37"),
                    new pl.type.Term("uppercase", []),
                    new pl.type.Var("_33"),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_142"),
                    new pl.type.Var("_143"),
                  ]),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Var("_60"),
                  new pl.type.Term(".", [
                    new pl.type.Term("chars", [new pl.type.Var("_33")]),
                    new pl.type.Var("_16"),
                  ]),
                  new pl.type.Var("_143"),
                  new pl.type.Var("_144"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("`", []),
                new pl.type.Term(".", [
                  new pl.type.Var("_145"),
                  new pl.type.Term(".", [
                    new pl.type.Term("t", []),
                    new pl.type.Var("_1"),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_147"),
            new pl.type.Var("_149"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_147"),
                new pl.type.Var("_148"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Term(".", [
                new pl.type.Term("glue", [
                  new pl.type.Var("_145"),
                  new pl.type.Var("_146"),
                ]),
                new pl.type.Var("_16"),
              ]),
              new pl.type.Var("_148"),
              new pl.type.Var("_149"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Term("t", []),
                new pl.type.Var("_1"),
              ]),
            ]),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_151"),
            new pl.type.Var("_153"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_151"),
                new pl.type.Var("_152"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Term(".", [
                new pl.type.Term("glue", [
                  new pl.type.Term(" ", []),
                  new pl.type.Var("_150"),
                ]),
                new pl.type.Var("_16"),
              ]),
              new pl.type.Var("_152"),
              new pl.type.Var("_153"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_154"),
            new pl.type.Var("_158"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("|", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Var("_2"),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_154"),
                new pl.type.Var("_155"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_155"),
                  new pl.type.Var("_156"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("cell", [
                  new pl.type.Var("_60"),
                  new pl.type.Var("_37"),
                  new pl.type.Var("_16"),
                  new pl.type.Var("_156"),
                  new pl.type.Var("_157"),
                ]),
                new pl.type.Term("cells", [
                  new pl.type.Var("_1"),
                  new pl.type.Var("_2"),
                  new pl.type.Var("_37"),
                  new pl.type.Term("[]", []),
                  new pl.type.Var("_157"),
                  new pl.type.Var("_158"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Var("_82"),
            ]),
            new pl.type.Var("_83"),
            new pl.type.Var("_159"),
            new pl.type.Var("_16"),
            new pl.type.Var("_160"),
            new pl.type.Var("_165"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument", [
                new pl.type.Var("_82"),
                new pl.type.Var("_37"),
                new pl.type.Term(".", [
                  new pl.type.Term("+", []),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Var("_83"),
                new pl.type.Var("_2"),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_160"),
                new pl.type.Var("_161"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_161"),
                  new pl.type.Var("_162"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term("is", [
                    new pl.type.Var("_60"),
                    new pl.type.Term("+", [
                      new pl.type.Var("_159"),
                      new pl.type.Var("_37"),
                    ]),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_162"),
                    new pl.type.Var("_163"),
                  ]),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term("cell", [
                    new pl.type.Var("_159"),
                    new pl.type.Var("_60"),
                    new pl.type.Var("_16"),
                    new pl.type.Var("_163"),
                    new pl.type.Var("_164"),
                  ]),
                  new pl.type.Term("cells", [
                    new pl.type.Var("_1"),
                    new pl.type.Var("_2"),
                    new pl.type.Var("_60"),
                    new pl.type.Term("[]", []),
                    new pl.type.Var("_164"),
                    new pl.type.Var("_165"),
                  ]),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Term(".", [
              new pl.type.Term("~", []),
              new pl.type.Term(".", [
                new pl.type.Var("_166"),
                new pl.type.Var("_167"),
              ]),
            ]),
            new pl.type.Var("_168"),
            new pl.type.Var("_169"),
            new pl.type.Var("_170"),
            new pl.type.Var("_172"),
            new pl.type.Var("_173"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("atom_chars", [
                new pl.type.Var("_171"),
                new pl.type.Term(".", [
                  new pl.type.Term("~", []),
                  new pl.type.Term(".", [
                    new pl.type.Var("_166"),
                    new pl.type.Term("[]", []),
                  ]),
                ]),
              ]),
              new pl.type.Term("throw", [
                new pl.type.Term("error", [
                  new pl.type.Term("domain_error", [
                    new pl.type.Term("format_string", []),
                    new pl.type.Var("_171"),
                  ]),
                  new pl.type.Term("/", [
                    new pl.type.Term("format_", []),
                    new pl.type.Num(2, false),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_172"),
              new pl.type.Var("_173"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("cells", [
            new pl.type.Var("_82"),
            new pl.type.Var("_2"),
            new pl.type.Var("_60"),
            new pl.type.Var("_16"),
            new pl.type.Var("_177"),
            new pl.type.Var("_179"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("phrase", [
                  new pl.type.Term("upto_what", [
                    new pl.type.Var("_174"),
                    new pl.type.Term("~", []),
                  ]),
                  new pl.type.Var("_82"),
                  new pl.type.Var("_1"),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_174"),
                  new pl.type.Term(".", [
                    new pl.type.Var("_175"),
                    new pl.type.Var("_176"),
                  ]),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_177"),
                new pl.type.Var("_178"),
              ]),
            ]),
            new pl.type.Term("cells", [
              new pl.type.Var("_1"),
              new pl.type.Var("_2"),
              new pl.type.Var("_60"),
              new pl.type.Term(".", [
                new pl.type.Term("chars", [new pl.type.Var("_174")]),
                new pl.type.Var("_16"),
              ]),
              new pl.type.Var("_178"),
              new pl.type.Var("_179"),
            ]),
          ])
        ),
      ],
      "n_newlines/3": [
        new pl.type.Rule(
          new pl.type.Term("n_newlines", [
            new pl.type.Num(0, false),
            new pl.type.Var("_180"),
            new pl.type.Var("_181"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("!", []),
            new pl.type.Term("=", [
              new pl.type.Var("_180"),
              new pl.type.Var("_181"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("n_newlines", [
            new pl.type.Num(1, false),
            new pl.type.Var("_182"),
            new pl.type.Var("_184"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_182"),
                new pl.type.Var("_183"),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_183"),
              new pl.type.Term(".", [
                new pl.type.Term("newline", []),
                new pl.type.Var("_184"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("n_newlines", [
            new pl.type.Var("_49"),
            new pl.type.Var("_185"),
            new pl.type.Var("_188"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term(">", [
                  new pl.type.Var("_49"),
                  new pl.type.Num(1, false),
                ]),
                new pl.type.Term("is", [
                  new pl.type.Var("_47"),
                  new pl.type.Term("-", [
                    new pl.type.Var("_49"),
                    new pl.type.Num(1, false),
                  ]),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_185"),
                new pl.type.Var("_186"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("=", [
                new pl.type.Var("_186"),
                new pl.type.Term(".", [
                  new pl.type.Term("newline", []),
                  new pl.type.Var("_187"),
                ]),
              ]),
              new pl.type.Term("n_newlines", [
                new pl.type.Var("_47"),
                new pl.type.Var("_187"),
                new pl.type.Var("_188"),
              ]),
            ]),
          ])
        ),
      ],
      "upto_what/4": [
        new pl.type.Rule(
          new pl.type.Term("upto_what", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_189"),
            new pl.type.Var("_190"),
            new pl.type.Var("_193"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("=", [
                new pl.type.Var("_190"),
                new pl.type.Term(".", [
                  new pl.type.Var("_189"),
                  new pl.type.Var("_191"),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("!", []),
                new pl.type.Term("=", [
                  new pl.type.Var("_191"),
                  new pl.type.Var("_192"),
                ]),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_193"),
              new pl.type.Term(".", [
                new pl.type.Var("_189"),
                new pl.type.Var("_192"),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("upto_what", [
            new pl.type.Term(".", [
              new pl.type.Var("_166"),
              new pl.type.Var("_33"),
            ]),
            new pl.type.Var("_189"),
            new pl.type.Term(".", [
              new pl.type.Var("_166"),
              new pl.type.Var("_195"),
            ]),
            new pl.type.Var("_197"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_195"),
                new pl.type.Var("_196"),
              ]),
            ]),
            new pl.type.Term("upto_what", [
              new pl.type.Var("_33"),
              new pl.type.Var("_189"),
              new pl.type.Var("_196"),
              new pl.type.Var("_197"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("upto_what", [
            new pl.type.Term("[]", []),
            new pl.type.Var("_198"),
            new pl.type.Var("_199"),
            new pl.type.Var("_199"),
          ]),
          new pl.type.Term("true", [])
        ),
      ],
      "groups_of_three/3": [
        new pl.type.Rule(
          new pl.type.Term("groups_of_three", [
            new pl.type.Term(".", [
              new pl.type.Var("_171"),
              new pl.type.Term(".", [
                new pl.type.Var("_200"),
                new pl.type.Term(".", [
                  new pl.type.Var("_166"),
                  new pl.type.Term(".", [
                    new pl.type.Var("_201"),
                    new pl.type.Var("_202"),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Var("_203"),
            new pl.type.Var("_207"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term("!", []),
              new pl.type.Term("=", [
                new pl.type.Var("_203"),
                new pl.type.Var("_204"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("=", [
                new pl.type.Var("_204"),
                new pl.type.Term(".", [
                  new pl.type.Var("_171"),
                  new pl.type.Term(".", [
                    new pl.type.Var("_200"),
                    new pl.type.Term(".", [
                      new pl.type.Var("_166"),
                      new pl.type.Var("_205"),
                    ]),
                  ]),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("=", [
                  new pl.type.Var("_205"),
                  new pl.type.Term(".", [
                    new pl.type.Term(",", []),
                    new pl.type.Var("_206"),
                  ]),
                ]),
                new pl.type.Term("groups_of_three", [
                  new pl.type.Term(".", [
                    new pl.type.Var("_201"),
                    new pl.type.Var("_202"),
                  ]),
                  new pl.type.Var("_206"),
                  new pl.type.Var("_207"),
                ]),
              ]),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("groups_of_three", [
            new pl.type.Var("_38"),
            new pl.type.Var("_208"),
            new pl.type.Var("_209"),
          ]),
          new pl.type.Term("list", [
            new pl.type.Var("_38"),
            new pl.type.Var("_208"),
            new pl.type.Var("_209"),
          ])
        ),
      ],
      "cell/5": [
        new pl.type.Rule(
          new pl.type.Term("cell", [
            new pl.type.Var("_14"),
            new pl.type.Var("_15"),
            new pl.type.Var("_210"),
            new pl.type.Var("_211"),
            new pl.type.Var("_214"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(";", [
              new pl.type.Term("->", [
                new pl.type.Term(",", [
                  new pl.type.Term("==", [
                    new pl.type.Var("_210"),
                    new pl.type.Term("[]", []),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_211"),
                    new pl.type.Var("_212"),
                  ]),
                ]),
                new pl.type.Term("true", []),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(",", [
                  new pl.type.Term("reverse", [
                    new pl.type.Var("_210"),
                    new pl.type.Var("_16"),
                  ]),
                  new pl.type.Term("=", [
                    new pl.type.Var("_211"),
                    new pl.type.Var("_213"),
                  ]),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("_213"),
                  new pl.type.Term(".", [
                    new pl.type.Term("cell", [
                      new pl.type.Var("_14"),
                      new pl.type.Var("_15"),
                      new pl.type.Var("_16"),
                    ]),
                    new pl.type.Var("_214"),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Term("=", [
              new pl.type.Var("_212"),
              new pl.type.Var("_214"),
            ]),
          ])
        ),
      ],
      "numeric_argument/5": [
        new pl.type.Rule(
          new pl.type.Term("numeric_argument", [
            new pl.type.Var("Ds"),
            new pl.type.Var("Num"),
            new pl.type.Var("Rest"),
            new pl.type.Var("Args0"),
            new pl.type.Var("Args"),
          ]),
          new pl.type.Term(";", [
            new pl.type.Term("->", [
              new pl.type.Term("=", [
                new pl.type.Var("Ds"),
                new pl.type.Term(".", [
                  new pl.type.Term("*", []),
                  new pl.type.Var("Rest"),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("Args0"),
                new pl.type.Term(".", [
                  new pl.type.Var("Num"),
                  new pl.type.Var("Args"),
                ]),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("numeric_argument_", [
                new pl.type.Var("Ds"),
                new pl.type.Term("[]", []),
                new pl.type.Var("Ns"),
                new pl.type.Var("Rest"),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("foldl", [
                  new pl.type.Term("pow10", []),
                  new pl.type.Var("Ns"),
                  new pl.type.Term("-", [
                    new pl.type.Num(0, false),
                    new pl.type.Num(0, false),
                  ]),
                  new pl.type.Term("-", [
                    new pl.type.Var("Num"),
                    new pl.type.Var("_"),
                  ]),
                ]),
                new pl.type.Term("=", [
                  new pl.type.Var("Args0"),
                  new pl.type.Var("Args"),
                ]),
              ]),
            ]),
          ])
        ),
      ],
      "numeric_argument_/4": [
        new pl.type.Rule(
          new pl.type.Term("numeric_argument_", [
            new pl.type.Term(".", [
              new pl.type.Var("D"),
              new pl.type.Var("Ds"),
            ]),
            new pl.type.Var("Ns0"),
            new pl.type.Var("Ns"),
            new pl.type.Var("Rest"),
          ]),
          new pl.type.Term(";", [
            new pl.type.Term("->", [
              new pl.type.Term("member", [
                new pl.type.Var("D"),
                new pl.type.Term(".", [
                  new pl.type.Term("0", []),
                  new pl.type.Term(".", [
                    new pl.type.Term("1", []),
                    new pl.type.Term(".", [
                      new pl.type.Term("2", []),
                      new pl.type.Term(".", [
                        new pl.type.Term("3", []),
                        new pl.type.Term(".", [
                          new pl.type.Term("4", []),
                          new pl.type.Term(".", [
                            new pl.type.Term("5", []),
                            new pl.type.Term(".", [
                              new pl.type.Term("6", []),
                              new pl.type.Term(".", [
                                new pl.type.Term("7", []),
                                new pl.type.Term(".", [
                                  new pl.type.Term("8", []),
                                  new pl.type.Term(".", [
                                    new pl.type.Term("9", []),
                                    new pl.type.Term("[]", []),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term("number_chars", [
                  new pl.type.Var("N"),
                  new pl.type.Term(".", [
                    new pl.type.Var("D"),
                    new pl.type.Term("[]", []),
                  ]),
                ]),
                new pl.type.Term("numeric_argument_", [
                  new pl.type.Var("Ds"),
                  new pl.type.Term(".", [
                    new pl.type.Var("N"),
                    new pl.type.Var("Ns0"),
                  ]),
                  new pl.type.Var("Ns"),
                  new pl.type.Var("Rest"),
                ]),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("=", [
                new pl.type.Var("Ns"),
                new pl.type.Var("Ns0"),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("Rest"),
                new pl.type.Term(".", [
                  new pl.type.Var("D"),
                  new pl.type.Var("Ds"),
                ]),
              ]),
            ]),
          ])
        ),
      ],
      "pow10/3": [
        new pl.type.Rule(
          new pl.type.Term("pow10", [
            new pl.type.Var("D"),
            new pl.type.Term("-", [
              new pl.type.Var("N0"),
              new pl.type.Var("Pow0"),
            ]),
            new pl.type.Term("-", [
              new pl.type.Var("N"),
              new pl.type.Var("Pow"),
            ]),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("is", [
              new pl.type.Var("N"),
              new pl.type.Term("+", [
                new pl.type.Var("N0"),
                new pl.type.Term("*", [
                  new pl.type.Var("D"),
                  new pl.type.Term("^", [
                    new pl.type.Num(10, false),
                    new pl.type.Var("Pow0"),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Term("is", [
              new pl.type.Var("Pow"),
              new pl.type.Term("+", [
                new pl.type.Var("Pow0"),
                new pl.type.Num(1, false),
              ]),
            ]),
          ])
        ),
      ],
      "integer_to_radix/4": [
        new pl.type.Rule(
          new pl.type.Term("integer_to_radix", [
            new pl.type.Var("I"),
            new pl.type.Var("R"),
            new pl.type.Var("Which"),
            new pl.type.Var("Cs"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(";", [
              new pl.type.Term("->", [
                new pl.type.Term("integer", [new pl.type.Var("I")]),
                new pl.type.Term("true", []),
              ]),
              new pl.type.Term("throw", [
                new pl.type.Term("error", [
                  new pl.type.Term("type_error", [
                    new pl.type.Term("integer", []),
                    new pl.type.Var("I"),
                  ]),
                  new pl.type.Term("/", [
                    new pl.type.Term("format_", []),
                    new pl.type.Num(2, false),
                  ]),
                ]),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term(";", [
                new pl.type.Term("->", [
                  new pl.type.Term("integer", [new pl.type.Var("R")]),
                  new pl.type.Term("true", []),
                ]),
                new pl.type.Term("throw", [
                  new pl.type.Term("error", [
                    new pl.type.Term("type_error", [
                      new pl.type.Term("integer", []),
                      new pl.type.Var("R"),
                    ]),
                    new pl.type.Term("/", [
                      new pl.type.Term("format_", []),
                      new pl.type.Num(2, false),
                    ]),
                  ]),
                ]),
              ]),
              new pl.type.Term(",", [
                new pl.type.Term(";", [
                  new pl.type.Term("->", [
                    new pl.type.Term("\\+", [
                      new pl.type.Term("between", [
                        new pl.type.Num(2, false),
                        new pl.type.Num(36, false),
                        new pl.type.Var("R"),
                      ]),
                    ]),
                    new pl.type.Term("domain_error", [
                      new pl.type.Term("radix", []),
                      new pl.type.Var("R"),
                      new pl.type.Term("//", [
                        new pl.type.Term("format_", []),
                        new pl.type.Num(2, false),
                      ]),
                    ]),
                  ]),
                  new pl.type.Term("true", []),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term("digits", [
                    new pl.type.Var("Which"),
                    new pl.type.Var("Ds"),
                  ]),
                  new pl.type.Term(",", [
                    new pl.type.Term(";", [
                      new pl.type.Term("->", [
                        new pl.type.Term("<", [
                          new pl.type.Var("I"),
                          new pl.type.Num(0, false),
                        ]),
                        new pl.type.Term(",", [
                          new pl.type.Term("is", [
                            new pl.type.Var("Pos"),
                            new pl.type.Term("abs", [new pl.type.Var("I")]),
                          ]),
                          new pl.type.Term("phrase", [
                            new pl.type.Term("integer_to_radix_", [
                              new pl.type.Var("Pos"),
                              new pl.type.Var("R"),
                              new pl.type.Var("Ds"),
                            ]),
                            new pl.type.Var("Cs0"),
                            new pl.type.Term(".", [
                              new pl.type.Term("-", []),
                              new pl.type.Term("[]", []),
                            ]),
                          ]),
                        ]),
                      ]),
                      new pl.type.Term(";", [
                        new pl.type.Term("->", [
                          new pl.type.Term("=:=", [
                            new pl.type.Var("I"),
                            new pl.type.Num(0, false),
                          ]),
                          new pl.type.Term("=", [
                            new pl.type.Var("Cs0"),
                            new pl.type.Term(".", [
                              new pl.type.Term("0", []),
                              new pl.type.Term("[]", []),
                            ]),
                          ]),
                        ]),
                        new pl.type.Term("phrase", [
                          new pl.type.Term("integer_to_radix_", [
                            new pl.type.Var("I"),
                            new pl.type.Var("R"),
                            new pl.type.Var("Ds"),
                          ]),
                          new pl.type.Var("Cs0"),
                        ]),
                      ]),
                    ]),
                    new pl.type.Term("reverse", [
                      new pl.type.Var("Cs0"),
                      new pl.type.Var("Cs"),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ])
        ),
      ],
      "integer_to_radix_/5": [
        new pl.type.Rule(
          new pl.type.Term("integer_to_radix_", [
            new pl.type.Num(0, false),
            new pl.type.Var("_215"),
            new pl.type.Var("_216"),
            new pl.type.Var("_217"),
            new pl.type.Var("_218"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("!", []),
            new pl.type.Term("=", [
              new pl.type.Var("_217"),
              new pl.type.Var("_218"),
            ]),
          ])
        ),
        new pl.type.Rule(
          new pl.type.Term("integer_to_radix_", [
            new pl.type.Var("_219"),
            new pl.type.Var("_220"),
            new pl.type.Var("_88"),
            new pl.type.Var("_223"),
            new pl.type.Var("_226"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term(",", [
              new pl.type.Term(",", [
                new pl.type.Term("is", [
                  new pl.type.Var("_221"),
                  new pl.type.Term("mod", [
                    new pl.type.Var("_219"),
                    new pl.type.Var("_220"),
                  ]),
                ]),
                new pl.type.Term(",", [
                  new pl.type.Term("nth0", [
                    new pl.type.Var("_221"),
                    new pl.type.Var("_88"),
                    new pl.type.Var("_201"),
                  ]),
                  new pl.type.Term("is", [
                    new pl.type.Var("_222"),
                    new pl.type.Term("//", [
                      new pl.type.Var("_219"),
                      new pl.type.Var("_220"),
                    ]),
                  ]),
                ]),
              ]),
              new pl.type.Term("=", [
                new pl.type.Var("_223"),
                new pl.type.Var("_224"),
              ]),
            ]),
            new pl.type.Term(",", [
              new pl.type.Term("=", [
                new pl.type.Var("_224"),
                new pl.type.Term(".", [
                  new pl.type.Var("_201"),
                  new pl.type.Var("_225"),
                ]),
              ]),
              new pl.type.Term("integer_to_radix_", [
                new pl.type.Var("_222"),
                new pl.type.Var("_220"),
                new pl.type.Var("_88"),
                new pl.type.Var("_225"),
                new pl.type.Var("_226"),
              ]),
            ]),
          ])
        ),
      ],
      "digits/2": [
        new pl.type.Rule(
          new pl.type.Term("digits", [
            new pl.type.Term("lowercase", []),
            new pl.type.Term(".", [
              new pl.type.Term("0", []),
              new pl.type.Term(".", [
                new pl.type.Term("1", []),
                new pl.type.Term(".", [
                  new pl.type.Term("2", []),
                  new pl.type.Term(".", [
                    new pl.type.Term("3", []),
                    new pl.type.Term(".", [
                      new pl.type.Term("4", []),
                      new pl.type.Term(".", [
                        new pl.type.Term("5", []),
                        new pl.type.Term(".", [
                          new pl.type.Term("6", []),
                          new pl.type.Term(".", [
                            new pl.type.Term("7", []),
                            new pl.type.Term(".", [
                              new pl.type.Term("8", []),
                              new pl.type.Term(".", [
                                new pl.type.Term("9", []),
                                new pl.type.Term(".", [
                                  new pl.type.Term("a", []),
                                  new pl.type.Term(".", [
                                    new pl.type.Term("b", []),
                                    new pl.type.Term(".", [
                                      new pl.type.Term("c", []),
                                      new pl.type.Term(".", [
                                        new pl.type.Term("d", []),
                                        new pl.type.Term(".", [
                                          new pl.type.Term("e", []),
                                          new pl.type.Term(".", [
                                            new pl.type.Term("f", []),
                                            new pl.type.Term(".", [
                                              new pl.type.Term("g", []),
                                              new pl.type.Term(".", [
                                                new pl.type.Term("h", []),
                                                new pl.type.Term(".", [
                                                  new pl.type.Term("i", []),
                                                  new pl.type.Term(".", [
                                                    new pl.type.Term("j", []),
                                                    new pl.type.Term(".", [
                                                      new pl.type.Term("k", []),
                                                      new pl.type.Term(".", [
                                                        new pl.type.Term(
                                                          "l",
                                                          []
                                                        ),
                                                        new pl.type.Term(".", [
                                                          new pl.type.Term(
                                                            "m",
                                                            []
                                                          ),
                                                          new pl.type.Term(
                                                            ".",
                                                            [
                                                              new pl.type.Term(
                                                                "n",
                                                                []
                                                              ),
                                                              new pl.type.Term(
                                                                ".",
                                                                [
                                                                  new pl.type.Term(
                                                                    "o",
                                                                    []
                                                                  ),
                                                                  new pl.type.Term(
                                                                    ".",
                                                                    [
                                                                      new pl.type.Term(
                                                                        "p",
                                                                        []
                                                                      ),
                                                                      new pl.type.Term(
                                                                        ".",
                                                                        [
                                                                          new pl.type.Term(
                                                                            "q",
                                                                            []
                                                                          ),
                                                                          new pl.type.Term(
                                                                            ".",
                                                                            [
                                                                              new pl.type.Term(
                                                                                "r",
                                                                                []
                                                                              ),
                                                                              new pl.type.Term(
                                                                                ".",
                                                                                [
                                                                                  new pl.type.Term(
                                                                                    "s",
                                                                                    []
                                                                                  ),
                                                                                  new pl.type.Term(
                                                                                    ".",
                                                                                    [
                                                                                      new pl.type.Term(
                                                                                        "t",
                                                                                        []
                                                                                      ),
                                                                                      new pl.type.Term(
                                                                                        ".",
                                                                                        [
                                                                                          new pl.type.Term(
                                                                                            "u",
                                                                                            []
                                                                                          ),
                                                                                          new pl.type.Term(
                                                                                            ".",
                                                                                            [
                                                                                              new pl.type.Term(
                                                                                                "v",
                                                                                                []
                                                                                              ),
                                                                                              new pl.type.Term(
                                                                                                ".",
                                                                                                [
                                                                                                  new pl.type.Term(
                                                                                                    "w",
                                                                                                    []
                                                                                                  ),
                                                                                                  new pl.type.Term(
                                                                                                    ".",
                                                                                                    [
                                                                                                      new pl.type.Term(
                                                                                                        "x",
                                                                                                        []
                                                                                                      ),
                                                                                                      new pl.type.Term(
                                                                                                        ".",
                                                                                                        [
                                                                                                          new pl.type.Term(
                                                                                                            "y",
                                                                                                            []
                                                                                                          ),
                                                                                                          new pl.type.Term(
                                                                                                            ".",
                                                                                                            [
                                                                                                              new pl.type.Term(
                                                                                                                "z",
                                                                                                                []
                                                                                                              ),
                                                                                                              new pl.type.Term(
                                                                                                                "[]",
                                                                                                                []
                                                                                                              ),
                                                                                                            ]
                                                                                                          ),
                                                                                                        ]
                                                                                                      ),
                                                                                                    ]
                                                                                                  ),
                                                                                                ]
                                                                                              ),
                                                                                            ]
                                                                                          ),
                                                                                        ]
                                                                                      ),
                                                                                    ]
                                                                                  ),
                                                                                ]
                                                                              ),
                                                                            ]
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]),
                                                      ]),
                                                    ]),
                                                  ]),
                                                ]),
                                              ]),
                                            ]),
                                          ]),
                                        ]),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          null
        ),
        new pl.type.Rule(
          new pl.type.Term("digits", [
            new pl.type.Term("uppercase", []),
            new pl.type.Term(".", [
              new pl.type.Term("0", []),
              new pl.type.Term(".", [
                new pl.type.Term("1", []),
                new pl.type.Term(".", [
                  new pl.type.Term("2", []),
                  new pl.type.Term(".", [
                    new pl.type.Term("3", []),
                    new pl.type.Term(".", [
                      new pl.type.Term("4", []),
                      new pl.type.Term(".", [
                        new pl.type.Term("5", []),
                        new pl.type.Term(".", [
                          new pl.type.Term("6", []),
                          new pl.type.Term(".", [
                            new pl.type.Term("7", []),
                            new pl.type.Term(".", [
                              new pl.type.Term("8", []),
                              new pl.type.Term(".", [
                                new pl.type.Term("9", []),
                                new pl.type.Term(".", [
                                  new pl.type.Term("A", []),
                                  new pl.type.Term(".", [
                                    new pl.type.Term("B", []),
                                    new pl.type.Term(".", [
                                      new pl.type.Term("C", []),
                                      new pl.type.Term(".", [
                                        new pl.type.Term("D", []),
                                        new pl.type.Term(".", [
                                          new pl.type.Term("E", []),
                                          new pl.type.Term(".", [
                                            new pl.type.Term("F", []),
                                            new pl.type.Term(".", [
                                              new pl.type.Term("G", []),
                                              new pl.type.Term(".", [
                                                new pl.type.Term("H", []),
                                                new pl.type.Term(".", [
                                                  new pl.type.Term("I", []),
                                                  new pl.type.Term(".", [
                                                    new pl.type.Term("J", []),
                                                    new pl.type.Term(".", [
                                                      new pl.type.Term("K", []),
                                                      new pl.type.Term(".", [
                                                        new pl.type.Term(
                                                          "L",
                                                          []
                                                        ),
                                                        new pl.type.Term(".", [
                                                          new pl.type.Term(
                                                            "M",
                                                            []
                                                          ),
                                                          new pl.type.Term(
                                                            ".",
                                                            [
                                                              new pl.type.Term(
                                                                "N",
                                                                []
                                                              ),
                                                              new pl.type.Term(
                                                                ".",
                                                                [
                                                                  new pl.type.Term(
                                                                    "O",
                                                                    []
                                                                  ),
                                                                  new pl.type.Term(
                                                                    ".",
                                                                    [
                                                                      new pl.type.Term(
                                                                        "P",
                                                                        []
                                                                      ),
                                                                      new pl.type.Term(
                                                                        ".",
                                                                        [
                                                                          new pl.type.Term(
                                                                            "Q",
                                                                            []
                                                                          ),
                                                                          new pl.type.Term(
                                                                            ".",
                                                                            [
                                                                              new pl.type.Term(
                                                                                "R",
                                                                                []
                                                                              ),
                                                                              new pl.type.Term(
                                                                                ".",
                                                                                [
                                                                                  new pl.type.Term(
                                                                                    "S",
                                                                                    []
                                                                                  ),
                                                                                  new pl.type.Term(
                                                                                    ".",
                                                                                    [
                                                                                      new pl.type.Term(
                                                                                        "T",
                                                                                        []
                                                                                      ),
                                                                                      new pl.type.Term(
                                                                                        ".",
                                                                                        [
                                                                                          new pl.type.Term(
                                                                                            "U",
                                                                                            []
                                                                                          ),
                                                                                          new pl.type.Term(
                                                                                            ".",
                                                                                            [
                                                                                              new pl.type.Term(
                                                                                                "V",
                                                                                                []
                                                                                              ),
                                                                                              new pl.type.Term(
                                                                                                ".",
                                                                                                [
                                                                                                  new pl.type.Term(
                                                                                                    "W",
                                                                                                    []
                                                                                                  ),
                                                                                                  new pl.type.Term(
                                                                                                    ".",
                                                                                                    [
                                                                                                      new pl.type.Term(
                                                                                                        "X",
                                                                                                        []
                                                                                                      ),
                                                                                                      new pl.type.Term(
                                                                                                        ".",
                                                                                                        [
                                                                                                          new pl.type.Term(
                                                                                                            "Y",
                                                                                                            []
                                                                                                          ),
                                                                                                          new pl.type.Term(
                                                                                                            ".",
                                                                                                            [
                                                                                                              new pl.type.Term(
                                                                                                                "Z",
                                                                                                                []
                                                                                                              ),
                                                                                                              new pl.type.Term(
                                                                                                                "[]",
                                                                                                                []
                                                                                                              ),
                                                                                                            ]
                                                                                                          ),
                                                                                                        ]
                                                                                                      ),
                                                                                                    ]
                                                                                                  ),
                                                                                                ]
                                                                                              ),
                                                                                            ]
                                                                                          ),
                                                                                        ]
                                                                                      ),
                                                                                    ]
                                                                                  ),
                                                                                ]
                                                                              ),
                                                                            ]
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]),
                                                      ]),
                                                    ]),
                                                  ]),
                                                ]),
                                              ]),
                                            ]),
                                          ]),
                                        ]),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          null
        ),
      ],
      "format/2": [
        new pl.type.Rule(
          new pl.type.Term("format", [
            new pl.type.Var("Fs"),
            new pl.type.Var("Args"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("phrase", [
              new pl.type.Term("format_", [
                new pl.type.Var("Fs"),
                new pl.type.Var("Args"),
              ]),
              new pl.type.Var("Cs"),
            ]),
            new pl.type.Term("maplist", [
              new pl.type.Term("write", []),
              new pl.type.Var("Cs"),
            ]),
          ])
        ),
      ],
      "format/3": [
        new pl.type.Rule(
          new pl.type.Term("format", [
            new pl.type.Var("Stream"),
            new pl.type.Var("Fs"),
            new pl.type.Var("Args"),
          ]),
          new pl.type.Term(",", [
            new pl.type.Term("phrase", [
              new pl.type.Term("format_", [
                new pl.type.Var("Fs"),
                new pl.type.Var("Args"),
              ]),
              new pl.type.Var("Cs"),
            ]),
            new pl.type.Term("maplist", [
              new pl.type.Term("write", [new pl.type.Var("Stream")]),
              new pl.type.Var("Cs"),
            ]),
          ])
        ),
      ],
    };
  };
  var exports = ["format_/4", "format/2", "format/3"];
  var options = function () {
    return {
      dependencies: ["lists", "charsio"],
    };
  };
  if (typeof module !== "undefined") {
    module.exports = function (p) {
      pl = p;
      new pl.type.Module(name, predicates(), exports, options());
    };
  } else {
    new pl.type.Module(name, predicates(), exports, options());
  }
}
