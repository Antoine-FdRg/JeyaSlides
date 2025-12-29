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
  'template:' 
    'name:' name=ID 
    (style=TemplateStyle)?
    ('titleTemplate:' titleTemplate=Element)?
    ('bodyTemplate:' bodyTemplate=Element)?
;

TemplateStyle:
  'style:' 
    ('backgroundColor:' backgroundColor=COLOR)?
    (font=Font)?
    (transition=Transition)?
;

Presentation:
  'presentation:' 
    'name:' name=STRING 
    ('author:' author=STRING)?
    ('displaySlideNumber:' displaySlideNumber=BOOLEAN)?
    ('template:' template=STRING)?
    "slides:" slides+=Slide+
;

Slide:
  '-slide:' 
    ('annotable:' annotable=BOOLEAN)?
    (transition=Transition)?
    'elements:' elements+=Element
;

Element infers Element:
  (Text | Image | Video | Quiz | Group) 
    (style=Style)?
    (position=Position)?
    (animation=Animation)?
;

Group infers Element:
  'group:'
    elements+=Element
    (elements+=Element)*;

Text:
  Code | BasicText;

Code:
  'code:' 
  'language:' language=STRING 
  'content:' content=STRING;

BasicText:
  (Paragraph | List) ('align:' TextAlignment)?;

Paragraph:
  type=TextType  ':' 
    'content:'content=STRING;

List:
  'list:'   
    ('ordered:' ordered=BOOLEAN)? 
    'items:' 
      '-'items+=STRING 
      ('-' items+=STRING)*;

Image:
  'image:' 
    'link:' link=STRING;
Video:
  'video:' 
    'link:' link=STRING;
Quiz:
  'quiz:' 
    'link:' link=STRING;

Style:
  'style:'
    (size=Size)?
    ('backgroundColor:' backgroundColor=COLOR)?
    (font=Font)?
    ('rotation:' rotation=NUMBER)?
;

Size:
  'size:'
  (
    ('width:' width=NUMBER) 
    ('height:' height=NUMBER)?
  ) | (
    ('width:' width=NUMBER)? 
    ('height:' height=NUMBER)
  );

Font:
  'font:'
    ('name:' name=STRING)?
    ('size:' size=NUMBER)?
    ('color:' color=COLOR)?
    ('transformations:'
      '-'transformations+=FontTransformation 
      ('-' transformations+=FontTransformation)* )?
;

terminal FontTransformation: 'bold' | 'italic' | 'underline';


Position:
  'position:' 
    ('x' ':' x=XPosition)?
    ('y' ':' y=YPosition)?
    ('z' ':' z=ZPosition)?
;

XPosition:
  CoordinatePosition | EnumXPosition;
YPosition:
  CoordinatePosition | EnumYPosition;
ZPosition:
  CoordinatePosition | EnumZPosition;

CoordinatePosition:
  value=NUMBER;

EnumXPosition returns string:
  'left' | 'center' | 'right';
EnumYPosition returns string:
  'top' | 'center' | 'bottom';
EnumZPosition returns string:
  'front' | 'behind';


Animation:
  "animation:"  
    'order:' order=NUMBER? 
    ComplexAnimation?;

ComplexAnimation:
  'type:' animationType=AnimationType 
      ('duration:' duration=NUMBER)?;

terminal AnimationType: 'fade-in' | 'zoom-in';

Transition:
  'transition:' 
    'type:' type=TransitionType 
    ('duration:' duration=NUMBER)?;

terminal TransitionType: 'slide-left' | 'slide-top';


TextAlignment returns string:
  'left' | 'center' | 'right' | 'justify';
TextType returns string:
  'title' | 'subtitle' | 'text';


terminal COLOR: /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/;
terminal BOOLEAN: /true|false/;
terminal NUMBER: /-?\d+(\.\d+)?/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"([^"\\]*(\\.[^"\\]*)*)"/;



hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal WS: /[ \t\r\n\uFEFF\u00A0]+/;