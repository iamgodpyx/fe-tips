// antd table通用拖拽方法
export const tableDnd = <T>(
    state: T[],
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    cb?: (dragIndex: number, dropIndex: number, data: T[], beforeData: T[]) => void,
) => ({
    // 开启draggable属性让元素可以拖拽
    draggable: true,
    // 开始拖拽，记录拖拽元素
    onDragStart: (ev: any) => {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text', ev.target.getAttribute('data-row-key'));
    },
    onDragEnter: (ev: any) => {
        const nodes = ev.target.parentNode.childNodes;
        nodes.forEach((item: any) => (item.style.borderTop = '2px dashed #1890ff'));
    },
    onDragLeave: (ev: any) => {
        const nodes = ev.target.parentNode.childNodes;
        nodes.forEach((item: any) => (item.style.borderTop = ''));
    },
    // 结束拖拽
    onDrop: (ev: any) => {
        const dragId = Number(ev.dataTransfer.getData('text'));
        const dropCol = ev.target.tagName !== 'TR' ? ev.target.parentNode : ev.target;
        // dropCol.parentNode.insertBefore(dragCol, dropCol); // DOM操作
        const dropId = Number(dropCol.getAttribute('data-row-key'));
        const dragIndex = state.findIndex((item: any, index) => index === dragId);
        const dropIndex = state.findIndex((item: any, index) => index === dropId);
        const data = [...state];
        const beforeData = [...state];
        const item = data.splice(dragIndex, 1); // 移除
        data.splice(dropIndex, 0, item[0]); // 插入
        // 乐观更新，先进行ui渲染
        setState(data);
        dropCol.childNodes.forEach((item: any) => (item.style.borderTop = ''));
        cb?.(dragIndex, dropIndex, data, beforeData);
    },
    onDragOver: (ev: any) => ev.preventDefault(),
});


// use
<Table
columns={tableColumns}
loading={loading}
dataSource={data}
pagination={false}
onRow={() => tableDnd(data, setData, handleTableDnd)}
/>



// 
const handleTableDnd = async (
    dragIndex: number,
    dropIndex: number,
    data: CategoryItem[],
    beforeData: CategoryItem[],
) => {
    const idList = data.map(item => {
        return Number(item.category_id);
    });

    const language = data?.[0]?.language;
    const parent_id = data?.[0]?.parent_id;
    try {
        const resp = await sortFAQCategory({
            sub_category_ids: JSON.stringify(idList),
            language,
            category_id: parent_id,
        });

        if (resp.code) {
            // 请求失败，还原ui
            setData(beforeData);
            message.error(resp.message);
            return;
        }

        message.success('success！loading...', 0.5, getCategoryList);
    } catch (error) {
        setData(beforeData);
        message.error(errorMsg);
    }
};