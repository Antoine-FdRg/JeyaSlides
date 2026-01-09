presentation: 
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
            size: 70 70
            backgroundColor: #0bac0b
            rotation: 45
    -slide:
      elements:
        -text: 
          content: "Stretched block"
          style:
            size: 10 auto
            backgroundColor: #555
        -text: 
          content: "Normal block"
          style:
            backgroundColor: #888
        -text: 
          content: "Wide block"
          style:
            size: 80 auto
            backgroundColor: #aaa
    -slide:
      elements:
        -group:
          style:
            size: 100 auto
          backgroundColor: #ccc
          elements:
            -text: 
              content: "30% width of the parent group"
              style:
                size: 30 auto
                backgroundColor: #888
            -text: 
              content: "50% width of the parent group"
              style:
                size: 50 auto
                backgroundColor: #888
            -text: 
              content: "70% width of the parent group"
              style:
                size: 70 auto
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

