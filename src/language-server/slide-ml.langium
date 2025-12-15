grammar SlideML


entry Model:
    (definitions+=(Template | Presentation))*;


Template:
    'template' name=ID '{'
    ('style' style=TemplateStyle)?
    ('titleTemplate' titleTemplate=Element)?
    ('bodyTemplate' bodyTemplate=Element)?
  '}';

TemplateStyle:
    'templateStyle' '{'
    ('backgroundColor' ':' backgroundColor=STRING)?
    ('defaultFont' ':' defaultFont=Font)?
    ('defaultTransition' ':' defaultTransition=Transition)?
  '}';



Presentation:
    'presentation' name=STRING '{'
    ('author' author=STRING)?
    ('displaySlideNumber' displaySlideNumber=BOOLEAN)?
    ('template' template=[Template])?
    slides+=Slide+
  '}';

Slide:
    'slide' '{'
    ('annotable' annotable=BOOLEAN)?
    ('entryTransition' entryTransition=Transition)?
    elements+=Element*
  '}';



Element infers Element:
    content=(Group | Text | Image | Video | Quiz)
  ('style' style=Style)?
  ('position' position=Position)?
  ('animation' animation=Animation)?
;

Group infers Element:
    'group' '{'
    elements+=Element
    (elements+=Element)*
    '}';

Text:
    'text' content=STRING
  ('type' type=TextType)?
  ('alignment' alignment=TextAlignment)?
  (Code | Equation | List)?
;

Code:
    'code' 'language' language=STRING;
Equation:
    'equation' equation=STRING;

List:
    'list:{' 'ordered:' ordered=BOOLEAN 'content:' '{' items+=STRING+ '}}';

Image:
    'image' link=STRING;
Video:
    'video' link=STRING;
Quiz:
    'quiz' question=STRING;


Style:
    'style' '{'
    ('size' ':' size=NUMBER)?
    ('backgroundColor' ':' backgroundColor=STRING)?
    ('font' ':' font=Font)?
  '}';

Font:
    'font' '{'
    ('name' ':' name=STRING)?
    ('size' ':' size=NUMBER)?
    ('color' ':' color=STRING)?
    ('transformations' ':' '[' transformations+=FontTransformation (',' transformations+=FontTransformation)* ']')?
  '}';

terminal FontTransformation: 'BOLD' | 'ITALIC' | 'UNDERLINE';


Position:
    'position' '{'
    ('x' ':' x=XPosition)?
    ('y' ':' y=YPosition)?
    ('z' ':' z=ZPosition)?
  '}';

XPosition:
    CoordinatePosition | EnumXPosition;
YPosition:
    CoordinatePosition | EnumYPosition;
ZPosition:
    CoordinatePosition | EnumZPosition;

CoordinatePosition:
    value=NUMBER;

terminal EnumXPosition: 'LEFT' | 'CENTER' | 'RIGHT';
terminal EnumYPosition: 'TOP' | 'CENTER' | 'BOTTOM';
terminal EnumZPosition: 'FRONT' | 'BEHIND';


Animation:
    SimpleAnimation | ComplexAnimation;

SimpleAnimation:
    'animation' name=STRING;

ComplexAnimation:
    'complexAnimation' '{'
    'duration' ':' duration=NUMBER 'ms'
    'animationType' ':' animationType=AnimationType
  '}';

terminal AnimationType: 'FADE_IN' | 'ZOOM_IN';

Transition:
    'transition' '{'
    ('duration' ':' duration=NUMBER 'ms')?
    ('type' ':' type=TransitionType)?
  '}';

terminal TransitionType: 'SLIDE_LEFT' | 'SLIDE_TOP';


terminal TextAlignment: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFY';
terminal TextType: 'TITLE' | 'SUBTITLE' | 'BODY';



terminal BOOLEAN: /true|false/;
terminal NUMBER: /-?\d+(\.\d+)?/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"([^"\\]*(\\.[^"\\]*)*)"/;
