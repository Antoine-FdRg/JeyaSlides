presentation: 
  name: "Markdown text test"
  slides: 
    -slide: 
      elements: 
        -text: 
          content: "
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
            size:
              width: 10
            font:
              size: 32
    -slide: 
      elements: 
        - title:
          content: "Liste à puces"
        -list: 
          ordered:false
          items:
            -"coucou"
            -"salut"
            -"hello"
    -slide: 
      elements: 
        - title:
          content: "Liste numérotée"
        -list: 
          ordered: true
          items:
            -"Bonjour"
            -"Comment ça va ?"
            -"Tu t'appelles comment ?"
    -slide:
      elements:
        -title:
          content: "liste numérotée avec style"
        -list:
          ordered:true
          items:
            -"**Bonjour**"
            -"*Comment ça va ?*"
            -"__Très bien__"
          style:
            font:
              size: 40
              color: "#ff8800"
            rotation: 2


          

