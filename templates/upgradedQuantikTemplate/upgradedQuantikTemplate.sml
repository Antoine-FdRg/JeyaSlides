template:
  name: upgradedQuantikTemplate
  defaults:
    background:
      color: #fcf3e3

    textStyles:
      title:
        align: center
        font: "Playfair Display" 52
          color: "orange"
          transformations:
            - bold
            - italic

      subtitle:
        align: center
        font: "Playfair Display" 36
          color: #3c278a
          transformations:
            - bold
            - underline

      text:
        font: "Courier New" 24
          color: #127020

  titleTemplate:
    elements:
      - text:
          content: "Université Côte d'Azur"
          align: center
      - image:
          link: "../../templates/upgradedQuantikTemplate/assets/quantikLogo.jpg"
          style:
            size:
              width: 10
              height: 10

  bodyTemplate:
    elements:
      - group:
          elements:
            - text:
                content: "Quantik - Body template"
                align: center
