/** 待state变更后才设置Ref */
export function useRefState<T>(
    initialValue: T,
): [T, React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(initialValue);
    const stateRef = useRef<T>(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);
    return [state, stateRef, setState];
}

type SyncRefAction<T> = T | ((prev: T) => T);
/** 同步设置Ref，不等待state变更 */
export function useSyncRefState<T>(initialValue: T): [T, React.MutableRefObject<T>, React.Dispatch<SyncRefAction<T>>] {
    const [state, setState] = useState<T>(initialValue);
    const stateRef = useRef<T>(state);

    const setData = (v: SyncRefAction<T>) => {
        const isFn = (_v: SyncRefAction<T>): _v is (prev: T) => T => typeof v === 'function';
        const newState = isFn(v) ? v(state) : v;
        stateRef.current = newState;
        setState(newState);
    };

    return [state, stateRef, setData];
}