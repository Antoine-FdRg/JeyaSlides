presentation:
  slides:
    -slide:
      elements:
        -title: 
          content: "Code Slide Example"
        -code:
          content: 
          "
            fun factorial 0 = 1
            | factorial n = n * factorial (n - 1)
          "
    -slide:
      elements:
        -title: 
          content: "Python Code"
        -code:
          language: "python"
          content: 
          "
            def factorial(n):
                if n == 0:
                    return 1
                else:
                    return n * factorial(n - 1)
          "
    -slide:
      elements:
        -title: 
          content: "Line animated Code"
        -code:
          animated: true
          content: 
          " 
            sum = 0
            for i in range(10):
                sum += i
                print(sum)
          "