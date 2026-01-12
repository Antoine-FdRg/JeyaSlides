presentation:
    name: "Style tests!" 
    author: "ALLAIN Emma, Jessica Kahungu, Antoine Fadda-Rodriguez, Yannick "
    displaySlideNumber: true
    template: "finalPresentationTemplate"
    slides:
      -slide:
        transition:
          type: zoom-in
          duration: slow
          -title: "Slide Deck ML"
            style:
              font: 45
          -image: "https://www.svgrepo.com/show/483769/presentation-2.svg"
            style:
              size: 50 50
            
          -text: "ALLAIN Emma, Jessica Kahungu, Antoine Fadda-Rodriguez, Yannick "
            style:
              backgroundColor: #eec9d6
              font: 20
          -text: "12/01/2026"
            style:
              font: 12
     -slide:
        transition:
          type: fade
          duration: fast
        -title: "Sommaire"
            style:
                font: 28
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
            - "Plot"
            - "Visualisation d'équations"
            - "Analyse critique "
            style:
              font: 12
        -image: "https://www.svgrepo.com/show/530401/table-of-contents.svg"
            style:
              size: 15 15
            position:
              x: left
              y: top
        -image: "https://www.svgrepo.com/show/530397/date.svg"
            style:
                size: 15 15
            position:
                x: right
                y: bottom
        -slide:
            transition:
              type: slide
              duration: slow
            -title: "Introduction"
                style:
                font: 28
            -text: "TODO: mettre photo dm et petite description de lu'ilisation de langium"
                style:
                backgroundColor: #e0f23d
                font: 16
            -image: "images/dm.png"
        -slide:
            transition:
              type: slide
              duration: slow
            -title: "Résumé des fonctionnalités"
                style:
                font: 28
            -text: "Présentation des fonctionnalités implémentées dans notre DSL"
                style:
                backgroundColor: #e0f23d
                font: 16
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
                  font: 16
            -image: "https://www.svgrepo.com/show/355360/validate.svg"
                style:
                  size: 15 15
                position:
                  x: right
                  y: top
                  z: back
            -image: "https://www.svgrepo.com/show/450605/annotate-tool.svg"
                style:
                  size: 15 15
                position:
                  x: left
                  y: bottom
                  z: back
            -image: "https://www.svgrepo.com/show/500878/graph.svg"
                style:
                  size: 15 15
                position:
                    x: 80
                    y: bottom
                    z: back
            -image: "https://www.svgrepo.com/show/501182/equation.svg"
                style:
                  size: 15 15
                position:
                  x: left
                    y: top
                    z: back
            -text:"Passons maintenant aux détails de chaque fonctionnalité !"
                style:
                  font: 16
    -slide:
     transition:
        type: fade
        duration: default
      -title: "Texte  & styles"
        style:
          font: 28 
    -title: "Ce texte est un titre!"
    -subtitle: "Ce texte est un sous-titre!"
    -text: "Ceci est un texte simple à 12 %. Les textes suivant sont mis dans différents styles grâce à du markdown !"
        style:
          font: 12
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
     -text: "TODO : mettre une image de la grammaire ici"
        style:
        backgroundColor: #e0f23d
          font: 16
    -slide:
     transition:
        type: zoom-in
        duration: slow
      -title: "effets et styles"
        style:
          font: 28 
      -text: "TODO: mettre les effets et le bout de code langium "
        style:
          backgroundColor: #e0f23d
          font: 16
      -image: "images/annotation-example.png"
            style:
                size: 60 40
    -slide:
      transition:
          type: slide
          duration: slow
      -title: "Acceptance de notre DSL "
        style:
          font: 28 
      -text: "Pour aider l'utilisateur à accepter notre DSL nous avons mis en place une extension de preview qui permet de visualiser le rendu final de son document au fur et à mesure de la rédaction. Voici un exemple d'utilisation:"
        style:
          font: 16
      -video: "videos/demo-preview.mp4"
            style:
                size: 60 40
    -slide:
      transition:
        type: fade
        duration: default
      -title:   "Visualisation de code"
        style:
          font: 28
      -text: "Voici un exemple de code static en python:"
        style:
          font: 16
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
          font: 16
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
      transition:
        type: slide
        duration: slow
      -title: "Positionnement de nos éléments"
        style:
          font: 28
      -text: "TODO: voir si on peut pas faire mieux que ça"
        style:
          backgroundColor: #e0f23d
          font: 16
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
      transition:
        type: fade
        duration: default
      -title: "Quiz en live"
        style:
          font: 28
      -text: "TODO: mettre un exemple de quiz en live"
        style:
          backgroundColor: #e0f23d
          font: 16
    -slide:
      -title: "Utilisation de graphique"
        style:
          font: 28
      -text: "Cliquer pour faire apparaître le graphique. Chaque point représente un étudiant."
        style:
          font: 20
        -plot:
            type: scatter
            data:
              xAxis: [1, 2, 3, 4, 5]
              yAxis: [8, 10, 12, 15, 18]
              labels:
                ["Student A", "Student B", "Student C", "Student D", "Student E"]
            layout:
              xLabel: "Study hours"
              yLabel: "Test score"
            style:
              size: 15 15
            position:
              x: 70
              y: 25
            animation: 1
        -plot:
            type: bar
            data:
              xAxis: [1, 2, 3, 4]
              yAxis: [85, 90, 78, 88]
            labels:
              ["Math", "Science", "History", "Art"]
            layout:
              xLabel: "Subjects"
              yLabel: "Average Score"
            style:
              size: 15 15
            position:
              x: 70
              y: 70
            animation: 1
        -plot:
            type: line
            data:
              xAxis: [1, 2, 3, 4, 5]
              yAxis: [2, 3, 5, 7, 11]
            layout:
              xLabel: "Time"
              yLabel: "Value"
            style:
              size: 15 15
            position:
              x: 15
              y: 70
            animation: 1
        -plot:
            type: bar
            data:
              xAxis: [1, 2, 3, 4, 5, 6, 7, 8]
              yAxis: [5, 2, 6, 3, 7, 4, 5, 6]
            layout:
              xLabel: ""
              yLabel: ""
            style:
              size: 15 15
            position:
              x: 15
              y: 25
            animation: 1
      -slide:
      transition:
        type: zoom-in
        duration: slow
        -title: "Visualisation d'équations"
          style:
            font: 28 
        -text: "TODO: mettre un exemple de visualisation d'équations"
          style:
            backgroundColor: #e0f23d
            font: 16
      -slide:
      transition:
        type: concave
        duration: default    
        -title: "Analyse critique "
          style:
            font: 28
        -text: "TODO: mettre une analyse critique de notre DSL et des améliorations possibles"
          style:
            backgroundColor: #e0f23d
            font: 16
      -slide:
      transition:
        type: fade-out
        duration: fast
        -title: "Merci pour votre attention !"
          style:
            font: 28
        -text: "Des questions ?"
          style:
            font: 16
        -text: "Cette slide à été fait grâce à un template de présentation en SML. Vous pouvez trouver le template dans le dossier template de notre dépôt."
          style:
            font: 12

   
   
        