presentation:
    name: "Style tests!" 
    author: "ALLAIN Emma, Jessica Kahungu, Antoine Fadda-Rodriguez, Yannick "
    displaySlideNumber: true
    slides:
      -slide:
          -title: "Slide Deck ML"
            style:
              font:
                size: 45
          -image:
            link: "https://www.svgrepo.com/show/483769/presentation-2.svg"
            style:
              size: 50 50
            
          -text: "ALLAIN Emma, Jessica Kahungu, Antoine Fadda-Rodriguez, Yannick "
            style:
              backgroundColor: #eec9d6
              font:
                size: 20
          -text: "12/01/2026"
            style:
              font:
                size: 12
     -slide:
        -title: "Sommaire"
            style:
                font:
                    size: 28
        -list:
            ordered: true
            - "Introduction (DM, Langium)"
            - "Résumé des fonctionnalités"
            - "Annotations"
            - "Texte transformation"
            - "Styles"
            - "Acceptance de notre DSL / média"
            - "Visualisation de code"
            - "Positionnement de nos éléments"
            - "Quiz en live"
            - "Quiz en mode hors connexion"
            - "Plot"
            - "Visualisation d'équations"
            - "Analyse critique "
            style:
              font:
                size: 12
        -image:
            link: "https://www.svgrepo.com/show/530401/table-of-contents.svg"
            style:
              size: 15 15
            position:
              x: left
              y: top
        -image:
            link: "https://www.svgrepo.com/show/530397/date.svg"
            style:
                size: 15 15
            position:
                x: right
                y: bottom
        -slide:
            -title: "Introduction"
                style:
                font:
                    size: 28
            -text: "TODO: mettre photo dm et petite description de lu'ilisation de langium"
                style:
                backgroundColor: #e0f23d
                font:
                    size: 16
            -image:
                link: "images/dm.png"
        -slide:
            -title: "Résumé des fonctionnalités"
                style:
                font:
                    size: 28
            -text: "Présentation des fonctionnalités implémentées dans notre DSL"
                style:
                backgroundColor: #e0f23d
                font:
                    size: 16
            -list:
                ordered: false
                - "Scénario 1"
                - "Scénario 2"
                - "Acceptance de notre DSL"
                - "Annotations"
                - "Quiz"
                - "Plot"
                - "Visualisation d'équations"
                - "Positionnement des éléments"
                style:
                  font:
                    size: 16
            -image:
                link: "https://www.svgrepo.com/show/355360/validate.svg"
                style:
                  size: 15 15
                position:
                  x: right
                  y: top
                  z: back
            -image:
                link: "https://www.svgrepo.com/show/450605/annotate-tool.svg"
                style:
                  size: 15 15
                position:
                  x: left
                  y: bottom
                  z: back
            -image:
                link: "https://www.svgrepo.com/show/500878/graph.svg"
                style:
                  size: 15 15
                position:
                    x: right
                    y: bottom
                    z: back
            -image:
                link: "https://www.svgrepo.com/show/501182/equation.svg"
                style:
                  size: 15 15
                position:
                  x: left
                    y: top
                    z: back
            -text:"Passons maintenant aux détails de chaque fonctionnalité !"
                style:
                  font:
                    size: 16
    -slide:
      -title: "Texte  & styles"
        style:
          font:
            size: 28 
    -title: "Ce texte est un titre!"
    -subtitle: "Ce texte est un sous-titre!"
    -text: "Ceci est un texte simple à 12 %. Les textes suivant sont mis dans différents styles grâce à du markdown !"
        style:
          font:
            size: 12
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
          font:
            size: 32
     -text: "TODO : mettre une image de la grammaire ici"
        style:
        backgroundColor: #e0f23d
          font:
            size: 16
    -slide:
      -title: "effets et styles"
        style:
          font:
            size: 28 
      -text: "TODO: mettre les effets et le bout de code langium "
        style:
          backgroundColor: #e0f23d
          font:
            size: 16
      -image:
            link: "images/annotation-example.png"
            style:
                size: 60 40
    -slide:
      -title: "Acceptance de notre DSL "
        style:
          font:
            size: 28 
      -text: "Pour aider l'utilisateur à accepter notre DSL nous avons mis en place une extension de preview qui permet de visualiser le rendu final de son document au fur et à mesure de la rédaction. Voici un exemple d'utilisation:"
        style:
          font:
            size: 16
      -video:
            link: "videos/demo-preview.mp4"
            style:
                size: 60 40
    -slide:
      -title:   "Visualisation de code"
        style:
          font:
            size: 28
      -text: "Voici un exemple de code static en python:"
        style:
          font:
            size: 16
      -code:
        language: "python"  
        "
          def factorial(n):
              if n == 0:
                  return 1
              else:
                  return n * factorial(n - 1)
        "
      -text: "Voici un exemple de code avec animation ligne par ligne:"
        style:
          font:
            size: 16
      -code:
        language: "python"
        animated: true  
        " 
          sum = 0
          for i in range(10):
              sum += i
              print(sum)
        "
    -slide:
      -title: "Positionnement de nos éléments"
        style:
          font:
            size: 28
      -text: "TODO: voir si on peut pas faire mieux que ça"
        style:
          backgroundColor: #e0f23d
          font:
            size: 16
      -group:
        style:
          size: 80 80
          backgroundColor: #cccccc
          position:
            x: left
            y: center
        -text: "top center in the parent group"
          style:
            backgroundColor: #888
            position: center top
        -text: "left center in the parent group"
          style:
            backgroundColor: #888
            position:left center
        -group: 
          style:
            size: 50 50
            backgroundColor: #888
            font:
              color: "lightgrey"
            position: right bottom
          -text: "50 top in the parent group"
            style:
              backgroundColor: #522
              position: 50 top
          -text: "left 50 in the parent group"
            style:
              backgroundColor: #252
              position: left 50
    -slide:
      -title: "Quiz en live"
        style:
          font:
            size: 28
      -text: "TODO: mettre un exemple de quiz en live"
        style:
          backgroundColor: #e0f23d
          font:
            size: 16
   -slide:
      -title: "Quiz en mode hors connexion"
        style:
          font:
            size: 28
      -quiz:
          -info:
            name: "Quiz sur les capitales"
            description: "Ceci est un test sur les capitales, pour tester vos connaissances en géographie"
          -questions:
            -question:"Quelle est la capitale de la France ?"
              options:
                -option: "Paris" correct: true
                -option: "Lyon" correct: false
                -option: "Marseille" correct: false
              correctMessage: "Bravo ! Paris est la capitale."
              incorrectMessage: "Non 😅 La bonne réponse est Paris."
            -question:"Capitale de l’Espagne ?"
              options:
                -option: "Barcelone" correct: false
                -option: "Madrid" correct: true
              correctMessage: "Exact !"
              incorrectMessage: "Raté : c’est Madrid."
        