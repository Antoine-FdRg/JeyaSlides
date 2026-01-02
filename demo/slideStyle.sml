presentation: 
  name: "Style tests!" 
  author: "Antoine"
  slides:
    -slide:
      elements:
        -text: 
          content: "Colored background"
          style:
            backgroundColor: #f14b4b
    -slide:
      elements:
        -text: 
          content: "Rotated block"
          style:
            rotation: 45
    
    -slide:
      elements:
        -text: 
          content: "Rotated colored wide block"
          style:
            size:
              width: 70
              height: 70
            backgroundColor: #0bac0b
            rotation: 45
    -slide:
      elements:
        -text: 
          content: "Stretched block"
          style:
            size:
              width: 10
              height: 10
            backgroundColor: #555
        -text: 
          content: "Normal block"
          style:
            backgroundColor: #888
        -text: 
          content: "Wide block"
          style:
            size:
              width: 80
              height: 80
            backgroundColor: #aaa
    -slide:
      elements:
        -group:
          style:
            size:
              width: 80
          backgroundColor: #ccc
          elements:
            -text: 
              content: "30% width of the parent group"
              style:
                size:
                  width: 30
                backgroundColor: #888
            -text: 
              content: "50% width of the parent group"
              style:
                size:
                  width: 50
                backgroundColor: #888
            -text: 
              content: "70% width of the parent group"
              style:
                size:
                  width: 70
                backgroundColor: #888
    -slide:
      elements:
        -text: 
          content: "Text with custom font"
          style:
            backgroundColor: #a0a005
            font:
              name: "Times New Roman"
        -text: 
          content: "Text with custom font size"
          style:
            backgroundColor: #a0a005
            font:
              size: 30
        -text: 
          content: "Text with custom font color"
          style:
            backgroundColor: #a0a005
            font:
              color: #2a2a72
        -text: 
          content: "Text with custom font transformation"
          style:
            backgroundColor: #a0a005
            font:
              color: #2a2a72
              transformations:
                - bold
                - italic
                - underline
    -slide:
      elements:
        -text: 
          content: "Text with all customizations"
          style:
            backgroundColor: #5a05a0
            font:
              name: "Courier New"
              size: 64
              color: #ff00ff
              transformations:
                - bold
                - italic
                - underline

