presentation: 
  name: "Quizz tests!" 
  author: "Emma"
  slides:
    -slide:
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
    -slide:
      -title: "Quizz en ligne"
            align: center
            style:
                font: 
                    size: 20
        -quiz:
            link: "https://www.mentimeter.com/app/presentation/aljjw7k8kj17s534fb3xqk4qerr9aq47/embed"
            joinCode: "4769 2583"
            joinUrl: "https://www.menti.com"



