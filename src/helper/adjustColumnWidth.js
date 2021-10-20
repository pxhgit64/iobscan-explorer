export default function (el) {
    let widthList = [];
    el.querySelectorAll(".el-table__body tr").forEach(tr => {
        tr.querySelectorAll("td .cell").forEach((td, i) => {
            if (!widthList[i]) {
                if(td?.childNodes){
                    for (const childNode of td.childNodes) {
                        if(childNode.className && childNode?.className.includes('index_style')){
                            widthList[i] = [40]
                        }else {
                            widthList[i] = [100];
                        }
                    }
                }else {
                    widthList[i] = [100];
                }
            }
            let width = 0
            if (td.children?.length > 1) {
                for (const tdElement of td.children) {
                    width += tdElement.scrollWidth
                }
            } else if (td.children?.length === 1) {
                width = td.children[0].scrollWidth
            }
            widthList[i].push(width);
        });
    });
    return widthList.map(width => Math.max(...width));
}
