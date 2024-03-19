## 使用示例

#### 1

```js
import { BottomInput, init } from "@arco-design/mobile-react-serial-i18n";
// init({
//     isIOS: isiOS,
//     px2rem,
//     getPX,
//     onKeyboardShow: bridge?.view?.onKeyboardShow,
//     onKeyboardHide: bridge?.view?.onKeyboardHide,
// });
// export default function BottomInputDemo() {
//   return (
//     <BottomInput
//       permanent
//       placeholder={"inputPlaceholder"}
//       value={"commentValue"}
//       showSubmitBtn={true}
//       maxLength={1000}
//       // ref={inputRef}
//       // inputExtra={extraButtons}
//       // showInputExtra={!keyboardShow}
//       // onSubmit={handleSubmitComment}
//       // onKeyboardReady={handleKeyboard}
//       // onChange={handleInputChange}
//       // onCancel={handleCancelInput}
//     />
//   );
// }

// 输入框ref
const inputRef = useRef < SerialI18nBottomInputRef > null;

useEffect(() => {
  Tea(EVENTS.ENTER_QUERY, {
    bookid: bid,
  });
  return () => {
    const kb = inputRef.current?.keyboard;
    kb?.off(BottomInputEvent.Show, handleKeyboardShow);
    kb?.off(BottomInputEvent.Hide, handleKeyboardHide);
  };
}, []);
const handleFocus = (e: any) => {
  if (e.target.tagName === "IMG") {
    return;
  }
  if (btnStatus !== AIQueryInputBtnStatus.stop) {
    toggleInput({});
  }
};

const handleKeyboard: Exclude<
  SerialI18nBottomInputProps["onKeyboardReady"],
  undefined
> = useCallback((kb) => {
  if (!kb) {
    return;
  }
  kb.on(BottomInputEvent.Show, handleKeyboardShow);
  kb.on(BottomInputEvent.Hide, handleKeyboardHide);
}, []);

<div
  className={cs(
    "ai-query-bottom-input",
    { "show-extra": btnStatus !== AIQueryInputBtnStatus.none },
    // 等待敏感词校验时，文本颜色改变
    { "is-wait-sensitive": isWaitSensitive },
    { "is-ios": isIOS }
  )}
  onClick={handleFocus}
>
  <BottomInput
    disabled={btnStatus === AIQueryInputBtnStatus.stop}
    permanent
    placeholder={inputPlaceholder}
    ref={inputRef}
    value={queryValue}
    inputExtra={extraButtons}
    showInputExtra
    onChange={handleInputChange}
    maxLength={MAX_INPUT_LENGTH}
    onExceedMaxLength={handleExceedInputMaxLength}
    onKeyboardReady={handleKeyboard}
  />
</div>;
```
