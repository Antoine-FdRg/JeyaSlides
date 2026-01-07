grammar SlideML


entry Model:
  (
      template=Template
      (presentation=Presentation)?
    ) | (
      (template=Template)?
      presentation=Presentation
    );

TemplateSlot:
  'elements:'
    ('-' elements+=Element)+
;

Template:
  'template:'
    'name:' name=ID
    (defaults=TemplateDefaults)?
    ('titleTemplate:' titleTemplate=TemplateSlot)?
    ('bodyTemplate:' bodyTemplate=TemplateSlot)?
;

TemplateDefaults:
  'defaults:'
    (background=TemplateBackground)?
    (textStyles=TemplateTextStyles)?
;

TemplateBackground:
  'background:'
    'color:' color=COLOR
;

TemplateTextStyles:
  'textStyles:'
    (entries+=TemplateTextStyleEntry)+
;

TemplateTextStyleEntry:
  key=ID ':'
    ('align:' align=TextAlignment)?
    (font=Font)?
    ('transformations:'
      '-' transformations+=FontTransformation
      ('-' transformations+=FontTransformation)*
    )?
;

Presentation:
  'presentation:' 
    ('displaySlideNumber:' displaySlideNumber=BOOLEAN)?
    ('template:' template=STRING)?
    "slides:" 
      slides+=Slide+
;

Slide:
  '-slide:' 
    ('annotable:' annotable=BOOLEAN)?
    (transition=Transition)?
    'elements:' 
      ('-'elements+=Element)+
;

Element:
  Text | Image | Video | Quiz | Group;

Group:
  'group:'
    (style=Style)?
    (position=Position)?
    (animation=Animation)?
    'elements:'
      ('-'elements+=Element)+
;

Text:
  (Code | BasicText)
  (style=Style)?
  (position=Position)?
  (animation=Animation)?
;

Code:
  'code:' 
  'language:' language=STRING 
  'content:' content=STRING;

BasicText:
  (Paragraph | List) ('align:' align=TextAlignment)?;

Paragraph:
  type=TextType  ':' 
    'content:'content=STRING;

List:
  'list:'   
    ('ordered:' ordered=BOOLEAN)? 
    'items:' 
      '-'items+=STRING 
      ('-' items+=STRING)*
;

Image:
  'image:'
    'link:' link=STRING
  (style=Style)?
  (position=Position)?
  (animation=Animation)?
;

Video:
  'video:'
    'link:' link=STRING
  (style=Style)?
  (position=Position)?
  (animation=Animation)?
;

Quiz:
  'quiz:'
    'link:' link=STRING
  (style=Style)?
  (position=Position)?
  (animation=Animation)?
;

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
  'front' | 'back';


terminal EffectToken: /(none|fade|slide|convex|concave|zoom)(-in|-out)?/;

Animation:
  "animation:"  
    'order:' order=NUMBER? 
    ComplexAnimation?;

ComplexAnimation:
  'type:' animationType=EffectToken
  ('duration:' duration=NUMBER)?;


Transition:
  'transition:' 
    'type:' type=EffectToken 
    ('duration:' duration=DurationType)?;

TextAlignment returns string:
  'left' | 'center' | 'right' | 'justify';
TextType returns string:
  'title' | 'subtitle' | 'text';

DurationType returns string:
  'fast' | 'default' | 'slow';


terminal COLOR: /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/;
terminal BOOLEAN: /true|false/;
terminal NUMBER: /-?\d+(\.\d+)?/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"([^"\\]*(\\.[^"\\]*)*)"/;



hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal WS: /[ \t\r\n\uFEFF\u00A0]+/;