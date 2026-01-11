presentation:
  slides:
    -slide:
      -title:   "Code Slide Example"
      -code:  
        "
          fun factorial 0 = 1
          | factorial n = n * factorial (n - 1)
        "
    -slide:
      -title:   "Python Code"
      -code:
        language: "python"  
        "
          def factorial(n):
              if n == 0:
                  return 1
              else:
                  return n * factorial(n - 1)
        "
    -slide:
      -title:   "Line animated Code"
      -code:
        animated: true  
        " 
          sum = 0
          for i in range(10):
              sum += i
              print(sum)
        "