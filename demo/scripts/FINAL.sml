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
          -image: "https://www.svgrepo.com/show/483769/presentation-2.svg"
            style:
              size: 50 50
            position:
              x: center
              y: center
            
          -text: "ALLAIN Emma, Jessica Kahungu, Antoine Fadda-Rodriguez, Yannick ASCARI "
            style:
              backgroundColor: #d8f6fb
              font: 20
            position:
              y: 80
          -text: "12/01/2026"
            style:
              font: 12
            position:
              y: 90
     -slide:
        transition:
          type: fade
          duration: fast
        -title: "Sommaire"
        - group: [
          style: 
          size: 75 75
          position:
            x: 45
            y: center
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
                font: 35
        ]
        -image: "images/sommaire/archi.png"
            style:
              size: 25 25
            position:
              x: 80
              y: 30
              z: 10
        -image: "images/sommaire/position-preview.png"
            style:
              size: 25 25
            position:
              x: 70
              y: 40
              z: 15
        -image: "images/sommaire/code.png"
            style:
                size: 30 30
            position:
                x: 65
                y: 55
                z:20
        -image: "images/sommaire/graph.png"
            style:
                size: 30 30
            position:
                x: 60
                y: 75
                z: 25
        -slide:
            transition:
              type: slide
              duration: slow
            -title: "Introduction"
            -group: [
              style: 
                size: 45 70
                backgroundColor: #d8f6fb
              position:
                  x: 25
                  y: 55
              -text: "Vous pouvez zoomer sur la photo pour voir le Domain Model en plus gros"
                position: 
                  x:center
              -image: "images/dm.png"
                position: 
                  x:50
                  y:50
                  
            ]

            -group: [
              style: 
                size: 45 70

              position:
                  x: 73
                  y: 55
              -text: " Nous avons basé notre DSL sur un language externe: **Langium** ? Veuillez trouvez ci-joint une vidéo youtube explicative de comment utiliser ce language."
              -video: "https://www.youtube.com/watch?v=YdulTVCNB0E"
                  style:
                    size: 75 60
                  position:
                    x: center
                    y: 47
              -image:  "https://www.svgrepo.com/show/398579/warning.svg"
                style:
                  size: 8 8
                  position: 
                    x:20
                    y:87
              -text: "Cette vidéo est visualisable seulement avec de la connexion interne"
                  style:
                    font:
                      color: "red"
                  position: 
                    x:55
                    y:90 
            ]
        -slide:
            transition:
              type: slide
              duration: slow
            -title: "Résumé des fonctionnalités"
            -group: [
              style: 
                size: 45 70
                backgroundColor: #c7c2ca
              position:
                  x: 25
                  y: 55
              -text: "Cette slide a pour but de lister les fonctionnalités mise en place, qui sont résumées ici... Dans le premier scénario, une étudiante prépare une présentation pour son apprentissage en important un modèle imposé par son entreprise, intégrant logos, couleurs et polices spécifiques. Elle ajoute ensuite une diapositive de titre présentant son projet, son état d’avancement et une photo de son lieu de travail, puis une diapositive de plan sous forme de liste. La présentation se poursuit avec plusieurs diapositives incluant des animations pour faire apparaître progressivement textes et images, ainsi qu’une diapositive contenant une vidéo illustrant le travail réalisé sur site. Elle termine par une diapositive de conclusion et exporte le diaporama en format web utilisable hors ligne. Dans le second scénario, un enseignant conçoit des diapositives pour une introduction à la programmation en Python. Après les diapositives d’introduction, il ajoute des diapositives contenant du code Python avec coloration syntaxique, affiché progressivement ligne par ligne grâce à des animations. Les images associées évoluent en même temps que le code pour en illustrer le fonctionnement. Enfin, certaines diapositives combinent texte et images, dont la disposition peut être adaptée selon les besoins pédagogiques. "
                align: justify
                style:
                  font: 16
              
              -text: "**Ce texte est affreusement long pour une slide, nous sommes d'accord, vous pouvez utiliser le double click ou D pour annoter la slide afin d'annoter la slide et de mettre en avant les éléments que vous souhaitez.**"
                style:
                  font: 
                    color:"red"
                position:
                  x: 50
                  y: 70
                animation: 1 fade-down
            ]
            -image: "https://www.svgrepo.com/show/495911/arrow-right-2.svg"
              style:
              size: 15 15
              position: 
                x: 48
                y:50
              animation: 2 
              
            -group: [
              style: 
                size: 45 70
              position:
                  x: 73
                  y: 55
              animation: 2 fade-down
            -text: "Revenons à quelque chose de plus concis... Voici une liste des  __fonctionnalités implémentées __ :"
              style:
                font: 28
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
                  font: 25
              -image: "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f601.svg"
                style: 
                  size: 20 20
                position:
                  x: 75
                  y: 80
            ]
    -slide:
     transition:
        type: fade
        duration: default
      -title: "Texte  & styles"
      -group: [
          style: 
            size: 45 70
            backgroundColor: #d8f6fb
          position:
              x: 25
              y: 55
    -title: "Ce texte est un titre avec une couleur différente de la template!"
      style:
        font:
          color: "green"
    -subtitle: "Ce texte est un sous-titre! (Par défaut souligné)"
    -text: "Ceci est un texte simple à 12 %. Les textes suivant sont mis dans différents styles grâce à du markdown que notre générateur arrive à lire  !"
        style:
          font: 12
      -text:   "
            **Bold Text**
            *Italic Text*
            __Underline Text__
            ~~Strikethrough Text~~
            [Link Text](http://example.com)
            "
        style:
          size: 10 auto
          font: 30
        position:
          x:45
          y:65

      ]
      -text: "Voici un bout de notre language qui gère les textes."
      position:
        x:75
        y:25
        animation: 1
     -image: "images/code-text.png"
      position: 
        x: 75
        y: 55
      animation: 1
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
      -group: [
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
        -group: [
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
        ]
      ]
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

      -group:[
        position:
          x: 70
          y: 25
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
            size: 25 25
          animation: 1
      ]
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
              size: 25 25
            position:
              x: 75
              y: 50
            animation: 1

      -slide:
        -title: "Utilisation de graphique"
          style:
            font: 28
        -text: "Cliquer pour faire apparaître le graphique. Chaque point représente un étudiant."
          style:
            font: 20

        -plot:
            type: line
            data:
              xAxis: [1, 2, 3, 4, 5]
              yAxis: [2, 3, 5, 7, 11]
            layout:
              xLabel: "Time"
              yLabel: "Value"
            style:
              size: 25 25
            position:
              x: 25
              y: 50
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
              size: 25 25
            position:
              x: 75
              y: 50
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

   
   
        