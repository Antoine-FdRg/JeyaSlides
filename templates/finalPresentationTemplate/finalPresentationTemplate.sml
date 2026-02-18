template:
  name: upgradedQuantikTemplate

  defaults:
    backgroundColor: gradient "Azure" "White" horizontal

    transition:
      type: fade
      duration: slow

    textStyles:
      title:
        align: center
        font: "Helvetica" 52
          color: #4abfe0
          transformations:
            - bold

      subtitle:
        align: center
        font: "Helvetica" 30
          color: #06718e
          transformations:
            - bold
            - underline

      text:
        font: "Helvetica" 24
          color: #06718e

  titleTemplate:
    elements:
      - image: "https://univ-cotedazur.fr/medias/photo/uca-logo-haut-2-_1696580848089-png?ID_FICHE=1167951"
        style:
          size: 20 20
        position:
          x: left
          y: 8

      - image: "https://polytech.univ-cotedazur.fr/medias/photo/polytech-nice-sophia-p_1607613029361-png?ID_FICHE=1067179"
        style:
          size: 20 20
        position:
          x: 85
          y: top

      - text: "Equipe JEYA"
        style:
        position:
          x: left
          y: bottom

      - text: "Projet de DSL 2026"
        style:
        position:
          x: center
          y: bottom


  bodyTemplate:
    elements:
      - image: "https://univ-cotedazur.fr/medias/photo/uca-logo-haut-2-_1696580848089-png?ID_FICHE=1167951"
        style:
          size: 10 10
        position: left 5

      - image: "https://polytech.univ-cotedazur.fr/medias/photo/polytech-nice-sophia-p_1607613029361-png?ID_FICHE=1067179"
        style:
          size: 10 10
        position: 90 top