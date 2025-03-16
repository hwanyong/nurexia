# Widgets

blessed provides a rich collection of widgets for creating interactive terminal-based user interfaces.

## Basic Widgets

These widgets provide the fundamental building blocks for terminal interfaces:

- [Box](./box.md): Basic container element
- [Text](./text.md): Simple text display
- [Line](./line.md): Horizontal or vertical line
- [ScrollableBox](./scrollable-box.md): Box with scrolling capability
- [ScrollableText](./scrollable-text.md): Text with scrolling capability
- [BigText](./big-text.md): Large text display

## Form Widgets

These widgets are used for creating interactive forms and accepting user input:

- [Form](./form.md): Container for form elements
- [Input](./input.md): Base class for input elements
- [Textarea](./textarea.md): Multi-line text input
- [Textbox](./textbox.md): Single-line text input
- [Button](./button.md): Clickable button
- [Checkbox](./checkbox.md): Toggleable checkbox
- [RadioSet](./radioset.md): Container for radio buttons
- [RadioButton](./radiobutton.md): Radio button element

## List Widgets

These widgets display and manage collections of items:

- [List](./list.md): Selectable list of items
- [ListTable](./listtable.md): List with tabular data
- [ListBar](./listbar.md): Horizontal list of buttons
- [FileManager](./filemanager.md): File system browser

## Dialog Widgets

These widgets provide dialog-style interactions:

- [Message](./message.md): Message dialog
- [Question](./question.md): Question dialog
- [Prompt](./prompt.md): Input prompt
- [Loading](./loading.md): Loading indicator

## Data Visualization Widgets

These widgets help visualize data:

- [ProgressBar](./progressbar.md): Progress indicator
- [Table](./table.md): Data table
- [Log](./log.md): Log display

## Media Widgets

These widgets display media content:

- [Image](./image.md): Image display
- [ANSIImage](./ansiimage.md): ANSI art image display
- [OverlayImage](./overlayimage.md): Image overlay
- [Video](./video.md): Video player
- [Terminal](./terminal.md): Embedded terminal

## Layout Widgets

These widgets help with layout management:

- [Layout](./layout.md): Layout manager

## Widget Hierarchy

All widgets in blessed inherit from a common hierarchy:

```
Node
└── Element
    ├── Box
    │   ├── ScrollableBox
    │   │   ├── ScrollableText
    │   │   ├── List
    │   │   │   ├── FileManager
    │   │   │   ├── ListTable
    │   │   │   └── ListBar
    │   │   ├── Form
    │   │   ├── Input
    │   │   │   ├── Textarea
    │   │   │   │   └── Textbox
    │   │   │   ├── Button
    │   │   │   ├── Checkbox
    │   │   │   │   └── RadioButton
    │   │   │   └── ProgressBar
    │   │   ├── Table
    │   │   ├── Terminal
    │   │   ├── PromptBox
    │   │   │   ├── Prompt
    │   │   │   ├── Question
    │   │   │   └── Message
    │   │   └── Loading
    │   ├── BigText
    │   ├── Line
    │   └── Image
    │       ├── ANSIImage
    │       ├── OverlayImage
    │       └── Video
    ├── Text
    └── Layout
```

Each widget has its own set of options, methods, and events. Refer to the individual widget documentation for details.