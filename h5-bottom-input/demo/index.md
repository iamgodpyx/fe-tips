## 使用示例

#### 1

```js
import { BottomInput, init } from '@arco-design/mobile-react-serial-i18n';
// init({
//     isIOS: isiOS,
//     px2rem,
//     getPX,
//     onKeyboardShow: bridge?.view?.onKeyboardShow,
//     onKeyboardHide: bridge?.view?.onKeyboardHide,
// });
export default function BottomInputDemo() {
    return (
        <BottomInput
            permanent
            placeholder={'inputPlaceholder'}
            value={'commentValue'}
            showSubmitBtn={true}
            maxLength={1000}
            // ref={inputRef}
            // inputExtra={extraButtons}
            // showInputExtra={!keyboardShow}
            // onSubmit={handleSubmitComment}
            // onKeyboardReady={handleKeyboard}
            // onChange={handleInputChange}
            // onCancel={handleCancelInput}
        />
    );
}
```
