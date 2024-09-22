import { Node, mergeAttributes } from "@tiptap/core";

const ButtonNode = Node.create({
  name: "button",

  inline: true,
  group: "inline",
  selectable: false,

  addAttributes() {
    return {
      label: {
        default: "Click Me",
      },
      class: {
        default: "custom-button",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'button[data-type="button"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "button",
      mergeAttributes(HTMLAttributes, { "data-type": "button" }),
      HTMLAttributes.label,
    ];
  },

  addCommands() {
    return {
      insertButton:
        (label) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              label: label || "Click Me",
              class: "custom-button",
            },
          });
        },
    };
  },
});

export default ButtonNode;
