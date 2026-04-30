---
'@grid-table/core': patch
---

fix(core): useIntersectionRender 改用回调 ref 处理元素延迟挂载

将基于 `useEffect` 的观察建立改为回调 ref，使元素挂载/卸载时立即建立或释放 IntersectionObserver。修复初次提交后元素才被附加（如合并格 overlay 切换到普通态）时观察未建立、内容无法渲染的问题。
