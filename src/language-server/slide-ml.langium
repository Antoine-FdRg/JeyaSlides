grammar SlideML


entry Model:
  (
      definitions+=Template
      (definitions+=Presentation)?
    ) | (
      (definitions+=Template)?
      presentations+=Presentation
    );


Template:
  'template' name=ID '{'
    (style=TemplateStyle)?
    ('titleTemplate' titleTemplate=Element)?
    ('bodyTemplate' bodyTemplate=Element)?
  '}';

TemplateStyle:
  'style' '{'
    ('backgroundColor' backgroundColor=COLOR)?
    (font=Font)?
    (transition=Transition)?
  '}';

Presentation:
  'presentation' name=STRING '{'
    ('author' author=STRING)?
    ('displaySlideNumber' displaySlideNumber=BOOLEAN)?
    ('template' template=STRING)?
    slides+=Slide+
  '}';

Slide:
  'slide' '{'
    ('annotable' annotable=BOOLEAN)?
    (transition=Transition)?
    elements+=Element
  '}';

Element infers Element:
  (Text | Image | Video | Quiz) 
    (style=Style)?
    (position=Position)?
    (animation=Animation)? 
  '}' | 
  Group 
    (style=Style)?
    (position=Position)?
    (animation=Animation)? 
  ']'
;

Group infers Element:
  '['
    elements+=Element
    (elements+=Element)*;

Text:
  Code | BasicText;

Code:
  'code' 
  '{'
  language=STRING content=STRING;

BasicText:
  (Paragraph | List) 'align' TextAlignment;

Paragraph:
  type=TextType  '{' content=STRING;

List:
  'list'  '{' ('ordered' ordered=BOOLEAN)? '[' items+=STRING (',' items+=STRING)* ']';

Image:
  'image' '{' link=STRING;
Video:
  'video' '{' link=STRING;
Quiz:
  'quiz' '{' question=STRING;

Style:
  'style' '{'
    (size=Size)?
    ('backgroundColor' backgroundColor=COLOR)?
    (font=Font)?
    ('rotation' rotation=NUMBER)?
  '}';

Size:
  (
    ('width' width=NUMBER) ('height' height=NUMBER)?
  ) | (
    ('width' width=NUMBER)? ('height' height=NUMBER)
  );

Font:
  'font' '{'
    ('name' name=STRING)?
    ('size' size=NUMBER)?
    ('color' color=COLOR)?
    ('transformations' '[' transformations+=FontTransformation (',' transformations+=FontTransformation)* ']')?
  '}';

terminal FontTransformation: 'bold' | 'italic' | 'underline';


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

terminal EnumXPosition: 'left' | 'center' | 'right';
terminal EnumYPosition: 'top' | 'center' | 'bottom';
terminal EnumZPosition: 'front' | 'behind';


Animation:
  "animation" '{' 'order' order=NUMBER? ComplexAnimation? '}';

ComplexAnimation:
  'type' animationType=AnimationType ('duration' duration=NUMBER)?;

terminal AnimationType: 'fade-in' | 'zoom-in';

Transition:
  'transition' '{' 'type' type=TransitionType ('duration' duration=NUMBER)? '}';

terminal TransitionType: 'slide-left' | 'slide-top';


terminal TextAlignment: 'left' | 'center' | 'right' | 'justify';
terminal TextType: 'title' | 'subtitle' | 'text';


terminal COLOR: /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/;
terminal BOOLEAN: /true|false/;
terminal NUMBER: /-?\d+(\.\d+)?/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"([^"\\]*(\\.[^"\\]*)*)"/;
