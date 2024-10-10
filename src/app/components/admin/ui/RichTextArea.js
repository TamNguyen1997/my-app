import { EditorContent } from "@tiptap/react";
import ImageCms from "@/components/admin/ui/ImageCms";
import "./Tiptap.css";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useState } from "react";

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiImage2Fill,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiUnderline,
  RiH3,
  RiH4,
  RiTextWrap,
  RiSubscript2,
  RiSuperscript2,
  RiTable3,
  RiCheckboxLine,
  RiCheckboxMultipleFill,
  RiDoubleQuotesL,
  RiVideoFill,
  RiIndentIncrease,
  RiIndentDecrease,
  RiFileCopy2Line,
  RiFileCopy2Fill,
  RiFindReplaceLine,
} from "react-icons/ri";
import {
  LucideHighlighter,
  Pipette,
  TableCellsMerge,
  TableCellsSplit,
} from "lucide-react";

import {
  TbColumnRemove,
  TbColumnInsertLeft,
  TbRowRemove,
  TbRowInsertBottom,
  TbRowInsertTop,
  TbColumnInsertRight,
} from "react-icons/tb";

const RichTextEditor = ({ editor }) => {
  return (
    <div className="border border-t-0 rounded-lg">
      <div className="sticky top-0 translate-x-[-1px] bg-white w-[calc(100%_+_2px)] z-[1000]">
        <div
          className={`
            relative border rounded-t-lg before:content-[''] before:absolute before:inset-0 before:bg-gray-100 before:z-[-1] before:rounded-t-lg

          `}
        >
          <BlogToolBar editor={editor} />
        </div>
      </div>
      <div className="h-full w-full min-h-44 p-3 border rounded-b-lg bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const TEXT_COLOR = {
  "#000000": "bg-[#000000]",
  "#FFFFFF": "bg-[#FFFFFF]",
  "#CCCCCC": "bg-[#CCCCCC]",
  "#33FF33": "bg-[#33FF33]",
  "#009900": "bg-[#009900]",
  "#DC143C": "bg-[#DC143C]",
  "#F88379": "bg-[#F88379]",
  "#66B2FF": "bg-[#66B2FF]",
  "#0066CC": "bg-[#0066CC]",
  "#FFBF00": "bg-[#FFBF00]",
};

const BlogToolBar = ({ editor }) => {
  const iconClassName =
    "border w-6 h-6 justify-items-center items-center bg-white border";
  const imageModal = useDisclosure();
  const colorModal = useDisclosure();
  const linkModal = useDisclosure();
  const tableModal = useDisclosure();
  const [hyperlink, setHyperlink] = useState("");

  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [color, setColor] = useColor("#000000");
  const [tableInfo, setTableInfo] = useState({
    rows: 3,
    columns: 3,
  });

  const [showColorPick, setShowColorPick] = useState(false);

  const [selectedFont, setSelectedFont] = useState("Open Sans");
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [buttonText, setButtonText] = useState("");

  if (!editor) {
    return <></>;
  }

  const setTextColor = (value) => {
    setSelectedTextColor(value);
    editor.chain().focus().setColor(value).run();
  };

  const insertLink = () => {
    editor.commands.focus();
    if (!hyperlink) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: hyperlink })
      .run();
  };

  const addYoutubeVideo = () => {
    const url = prompt("Chèn link youtube");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  // -----------------------------------------------

  const fonts = [
    "Open Sans",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];

  const handleFontChange = (font) => {
    setSelectedFont(font);
    editor.chain().focus().setFontFamily(font).run();
  };

  const handleReplace = () => {
    if (!searchText || !replaceText) return;

    const content = editor.getHTML();

    const updatedContent = content.replace(
      new RegExp(searchText, "g"),
      replaceText
    );

    editor.commands.setContent(updatedContent);
    setSearchText("");
    setReplaceText("");
  };

  // const changeBackgroundColor = (color) => {
  //   setSelectedBackgroundColor(color);

  //   if (editor) {
  //     editor.chain().focus().setBackgroundColor(color).run();
  //   }
  // };

  const handleAddButton = () => {
    if (editor) {
      editor.chain().focus().insertButton(buttonText).run();
    }
  };

  return (
    <div className="p-3 flex gap-1 flex-wrap">
      <div className="flex flex-wrap [&>div]:mt-1.5 [&>div]:ml-0.5">
        <Tooltip showArrow content="Bold (Ctrl + B)">
          <div
            title="bold"
            className={`${iconClassName} ${editor.isActive("bold") ? "opacity-25" : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
          >
            <RiBold className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Italic (Ctrl + I)">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <RiItalic className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Strikethrough (Ctrl + Shift + S)">
          <div
            className={`${iconClassName} ${editor.isActive("strike") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <RiStrikethrough className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Underline (Ctrl + U)">
          <div
            className={`${iconClassName} ${editor.isActive("underline") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().setUnderline().run()}
          >
            <RiUnderline className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Code (Ctrl + E)">
          <div
            className={`${iconClassName} ${editor.isActive("code") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <RiCodeSSlashLine className="w-full h-full" />
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Tooltip showArrow content="Heading 1 (Ctrl + Alt + 1)">
          <div
            className={`${iconClassName} ${editor.isActive("heading", { level: 1 }) ? "opacity-25" : ""
              }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <RiH1 className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Heading 2 (Ctrl + Alt + 2)">
          <div
            className={`${iconClassName} ${editor.isActive("heading", { level: 2 }) ? "opacity-25" : ""
              }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <RiH2 className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Heading 3 (Ctrl + Alt + 3)">
          <div
            className={`${iconClassName} ${editor.isActive("heading", { level: 3 }) ? "opacity-25" : ""
              }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <RiH3 className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Heading 4 (Ctrl + Alt + 4)">
          <div
            className={`${iconClassName} ${editor.isActive("heading", { level: 4 }) ? "opacity-25" : ""
              }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <RiH4 className="w-full h-full" />
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Tooltip showArrow content="Ordered list (Ctrl + Alt + 7)">
          <div
            className={`${iconClassName} ${editor.isActive("orderedList") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <RiListOrdered className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Bullet list (Ctrl + Alt + 8)">
          <div
            className={`${iconClassName} ${editor.isActive("bulletList") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <RiListUnordered className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Blockquote (Ctrl + Shift + B)">
          <div
            className={`${iconClassName} ${editor.isActive("bulletList") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <RiDoubleQuotesL className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Left align (Ctrl + Shift + L)">
          <div
            className={`${iconClassName} ${editor.isActive({ textAlign: "left" }) ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <RiAlignLeft className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Center align (Ctrl + Shift + E)">
          <div
            className={`${iconClassName} ${editor.isActive({ textAlign: "center" }) ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <RiAlignCenter className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Right align (Ctrl + Shift + R)">
          <div
            className={`${iconClassName} ${editor.isActive({ textAlign: "right" }) ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <RiAlignRight className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Justify (Ctrl + Shift + J)">
          <div
            className={`${iconClassName} ${editor.isActive({ textAlign: "justify" }) ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <RiAlignJustify className="w-full h-full" />
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Tooltip showArrow content="Image">
          <div className={iconClassName} onClick={imageModal.onOpen}>
            <RiImage2Fill className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Link Youtube">
          <div className={iconClassName} onClick={addYoutubeVideo}>
            <RiVideoFill className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Link">
          <div className={iconClassName} onClick={linkModal.onOpen}>
            <RiLink className="w-full h-full" />
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Tooltip showArrow content="Break (Ctrl/Shift + Enter)">
          <div
            className={iconClassName}
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <RiTextWrap className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Highlight (Ctrl + Shift + H)">
          <div
            className={`${iconClassName} ${editor.isActive("highlight") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <LucideHighlighter className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Subscript (Ctrl + ,)">
          <div
            className={`${iconClassName} ${editor.isActive("subscript") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <RiSubscript2 className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Superscript (Ctrl + .)">
          <div
            className={`${iconClassName} ${editor.isActive("superscript") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <RiSuperscript2 className="w-full h-full" />
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Tooltip showArrow content="Line checkbox">
          <div
            className={`${iconClassName} ${editor.isActive("taskList") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <RiCheckboxLine className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Multiple checkbox">
          <div
            className={`${iconClassName} ${!editor.can().splitListItem("taskItem") ? "opacity-10" : ""
              }`}
            onClick={() =>
              editor.can().splitListItem("taskItem")
                ? editor.chain().focus().splitListItem("taskItem").run()
                : ""
            }
          >
            <RiCheckboxMultipleFill className="w-full h-full" />
          </div>
        </Tooltip>
      </div>
      <div className="flex flex-wrap [&>div]:mt-1.5 [&>div]:ml-0.5">
        <div
          className={`border w-10 rounded-large h-6`}
          style={{
            background: selectedTextColor,
          }}
        ></div>
        <Tooltip showArrow content="Text color">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => setShowColorPick(!showColorPick)}
            data-dropdown-toggle="dropdown"
          >
            <Pipette />
            {showColorPick ? (
              <div
                className="w-28 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute z-10"
                id="dropdown"
              >
                <ul
                  className="py-2 text-sm flex flex-col gap-4 text-center items-center m-auto"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <div className="items-center text-center m-auto">
                    <div className="flex flex-wrap pl-[6px]">
                      {Object.keys(TEXT_COLOR).map((key) => {
                        return (
                          <div
                            className={`w-5 h-5 border-2 hover:opacity-25`}
                            style={{
                              background: key,
                            }}
                            key={key}
                            onClick={() => {
                              setTextColor(key);
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-center items-center">
                    <button
                      onClick={() => colorModal.onOpen()}
                      className="border-3 rounded-md "
                    >
                      Chọn màu
                    </button>
                  </div>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </Tooltip>

        <div className="pr-5"></div>

        <Popover placement="bottom" showArrow={true}>
          <Tooltip showArrow content="Insert table">
            <div>
              <PopoverTrigger>
                <div
                  className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
                    }`}
                >
                  <RiTable3 className="w-full h-full" />
                </div>
              </PopoverTrigger>
            </div>
          </Tooltip>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold pb-2">Insert table</div>
              <div className="text-tiny">
                <Input
                  labelPlacement="outside"
                  type="number"
                  label="Rows"
                  placeholder="Enter table rows"
                  defaultValue={3}
                  onValueChange={(value) =>
                    setTableInfo({ ...tableInfo, rows: Math.floor(value || 1) })
                  }
                  className="[&_label]:text-xs [&_label]:leading-none pb-2"
                />
                <Input
                  labelPlacement="outside"
                  type="number"
                  label="Columns"
                  placeholder="Enter table columns"
                  defaultValue={3}
                  onValueChange={(value) =>
                    setTableInfo({
                      ...tableInfo,
                      columns: Math.floor(value || 1),
                    })
                  }
                  className="[&_label]:text-xs [&_label]:leading-none"
                />
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({
                        rows: tableInfo.rows,
                        cols: tableInfo.columns,
                        withHeaderRow: true,
                      })
                      .run()
                  }
                >
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip showArrow content="Delete table">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-grid-2x2-x"
            >
              <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
              <path d="m16 16 5 5" />
              <path d="m16 21 5-5" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip showArrow content="Delete column">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <TbColumnRemove className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Add column before">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <TbColumnInsertRight className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Add column after">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <TbColumnInsertLeft className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Add row before">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <TbRowInsertBottom className="w-full h-full" />
          </div>
        </Tooltip>

        {/* ----------------------------------------------- */}
        <Tooltip showArrow content="Add row after">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <TbRowInsertTop className="w-full h-full" />
          </div>
        </Tooltip>
        {/* ----------------------------------------------- */}

        <Tooltip showArrow content="Delete row">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <TbRowRemove className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Merge cells">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().mergeCells().run()}
          >
            <TableCellsMerge className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Split cell">
          <div
            className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
              }`}
            onClick={() => editor.chain().focus().splitCell().run()}
          >
            <TableCellsSplit className="w-full h-full" />
          </div>
        </Tooltip>
        {/* ----------------------------------------------- */}

        <div className="pr-5"></div>
        {/* <div className="flex flex-wrap [&>div]:ml-0.5">
          <div
            className={`border w-10 rounded-large h-6`}
            style={{
              background: selectedBackgroundColor,
            }}
          ></div>{" "}
          <Tooltip showArrow content="Background color">
            <div
              className={`${iconClassName}`}
              onClick={() =>
                setShowBackgroundColorPick(!showBackgroundColorPick)
              }
              data-dropdown-toggle="dropdown"
            >
              <Pipette />
              {showBackgroundColorPick ? (
                <div
                  className="w-28 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute z-10"
                  id="dropdown"
                >
                  <ul
                    className="py-2 text-sm flex flex-col gap-4 text-center items-center m-auto"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <div className="items-center text-center m-auto">
                      <div className="flex flex-wrap pl-[6px]">
                        {Object.keys(TEXT_COLOR).map((key) => (
                          <div
                            className={`w-5 h-5 border-2 hover:opacity-25 cursor-pointer`}
                            style={{
                              background: key,
                            }}
                            key={key}
                            onClick={() => {
                              changeBackgroundColor(key);
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center items-center">
                      <button
                        onClick={() => backgroundColorModal.onOpen()}
                        className="border-3 rounded-md"
                      >
                        Chọn màu
                      </button>
                    </div>
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </Tooltip>
        </div> */}

        <Popover placement="bottom" showArrow={true}>
          <Tooltip showArrow content="Replace">
            <div>
              <PopoverTrigger>
                <div
                  className={`${iconClassName} ${editor.isActive("italic") ? "opacity-25" : ""
                    }`}
                >
                  <RiFindReplaceLine className="w-full h-full" />
                </div>
              </PopoverTrigger>
            </div>
          </Tooltip>

          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold pb-2">Replace</div>
              <div className="text-tiny">
                <Input
                  type="text"
                  labelPlacement="outside"
                  label="Find"
                  placeholder="Find text"
                  defaultValue={""}
                  onValueChange={(value) => setSearchText(value)}
                  className="[&_label]:text-xs [&_label]:leading-none pb-2"
                />
                <Input
                  type="text"
                  labelPlacement="outside"
                  label="Replace"
                  placeholder="Replace"
                  defaultValue={""}
                  onValueChange={(value) => setReplaceText(value)}
                  className="[&_label]:text-xs [&_label]:leading-none"
                />
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={handleReplace}
                >
                  Replace
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="bottom" showArrow={true}>
          <Tooltip showArrow content="Add button">
            <div>
              <PopoverTrigger>
                <div className={`${iconClassName}`}>
                  <button className="w-full h-full italic">B</button>
                </div>
              </PopoverTrigger>
            </div>
          </Tooltip>

          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold pb-2">Add button</div>
              <div className="text-tiny">
                <Input
                  type="text"
                  labelPlacement="outside"
                  placeholder="Label button"
                  defaultValue={""}
                  onValueChange={(value) => setButtonText(value)}
                  className="[&_label]:text-xs [&_label]:leading-none pb-2"
                />
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={handleAddButton}
                >
                  Add button
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip showArrow content="Indent (Tab)">
          <div
            className={iconClassName}
            onClick={() => editor.commands.indent()}
          >
            <RiIndentIncrease className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Outdent (Shift + Tab)">
          <div
            className={iconClassName}
            onClick={() => editor.commands.outdent()}
          >
            <RiIndentDecrease className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Copy (Ctrl + C)">
          <div
            className={iconClassName}
            onClick={() => {
              const { from, to } = editor.state.selection;
              if (from !== to) {
                const selectedText = editor.state.doc.textBetween(
                  from,
                  to,
                  "\n",
                  " "
                );
                navigator.clipboard
                  .writeText(selectedText)
                  .then(() => {
                    console.log("Copied to clipboard:", selectedText);
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                  });
              }
            }}
          >
            <RiFileCopy2Line className="w-full h-full" />
          </div>
        </Tooltip>

        <Tooltip showArrow content="Paste (Ctrl + V)">
          <div
            className={iconClassName}
            onClick={() => {
              navigator.clipboard
                .readText()
                .then((text) => {
                  if (text) {
                    editor.chain().focus().insertContent(text).run();
                  }
                })
                .catch((err) => {
                  console.error("Failed to read clipboard contents: ", err);
                });
            }}
          >
            <RiFileCopy2Fill className="w-full h-full" />
          </div>
        </Tooltip>
        {/* ----------------------------------------------- */}
      </div>
      <div className="flex flex-wrap [&>div]:mt-1.5 [&>div]:ml-0.5 w-full">
        <Tooltip showArrow content="Choose font">
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-max h-8 mt-[6px] ml-[2px] text-[14px] p-1 border rounded focus:outline-none"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </Tooltip>
      </div>
      <div className="w-1/4"></div>
      <Modal
        isOpen={imageModal.isOpen}
        onOpenChange={imageModal.onOpenChange}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chèn hình
              </ModalHeader>
              <ModalBody>
                <ImageCms
                  disableAdd
                  onImageClick={(image) => {
                    editor
                      .chain()
                      .focus()
                      .setImage({
                        src: `${process.env.NEXT_PUBLIC_FILE_PATH + image.path
                          }`,
                      })
                      .run();
                    onClose();
                  }}
                  disableDelete
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={linkModal.isOpen} onOpenChange={linkModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chèn hình ảnh
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Link"
                  aria-label="Link"
                  defaultValue={editor.getAttributes("link").href}
                  onValueChange={setHyperlink}
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    insertLink();
                    onClose();
                  }}
                >
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={colorModal.isOpen} onOpenChange={colorModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chọn màu
              </ModalHeader>
              <ModalBody>
                <ColorPicker
                  width={456}
                  height={228}
                  color={color}
                  onChange={setColor}
                  hideHSV
                  dark
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setSelectedTextColor(color.hex);
                    editor.chain().focus().setColor(color.hex).run();
                    onClose();
                  }}
                >
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={tableModal.isOpen} onOpenChange={tableModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chọn màu
              </ModalHeader>
              <ModalBody>
                <ColorPicker
                  width={456}
                  height={228}
                  color={color}
                  onChange={setColor}
                  hideHSV
                  dark
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setSelectedTextColor(color.hex);
                    editor.chain().focus().setColor(color.hex).run();
                    onClose();
                  }}
                >
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* ----------------------------------------------- */}
      {/* <Modal
        isOpen={backgroundColorModal.isOpen}
        onOpenChange={backgroundColorModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chọn màu
              </ModalHeader>
              <ModalBody>
                <ColorPicker
                  width={456}
                  height={228}
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                  hideHSV
                  dark
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    changeBackgroundColor(color.hex);

                    onClose();
                  }}
                >
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default RichTextEditor;
