presentation: 
  name: "Markdown text test"
  slides: 
    -slide: 
      -text:   "
            **Bold Text**
            *Italic Text*
            __Underline Text__
            ~~Strikethrough Text~~
            `Inline Code`
            [Link Text](http://example.com)
            this line is a quite long line that should wrap around to the next line 
            "
        align: justify
        style:
          size: 10 auto
          font: 32
    -slide: 
      - title:  "Liste à puces"
      -list: 
        ordered: false
        -"[!coucou!] guys"
        -"salut"
        -"hello"
    -slide: 
      - title:  "Liste numérotée"
      -list: 
        ordered: true
        -"Bonjour"
        -"Comment ça va ?"
        -"Tu t'appelles comment ?"
    -slide:
      -title:  "liste numérotée avec style"
      -list:
        ordered: true
        -"**Bonjour**"
        -"*Comment ça va ?*"
        -"__Très bien__"
        style:
          font: 40
            color: "#ff8800"
          rotation: 2