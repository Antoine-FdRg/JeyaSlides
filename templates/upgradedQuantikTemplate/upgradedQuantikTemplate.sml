template:
  name: upgradedQuantikTemplate

  defaults:
    background:
      color: #fcf3e3

    transition:
      type: fade
      duration: slow

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
      - title: "Université Côte d'Azur"
        align: center

      - image: "../../templates/upgradedQuantikTemplate/assets/quantikLogo.jpg"
        style:
          size: 40 10

  bodyTemplate:
    elements:
      - group:
          - text: "Quantik - Body template"
            align: center
