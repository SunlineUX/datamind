import { ref, reactive, nextTick, onBeforeUnmount } from 'vue';

const GAP = 4;   // 浮层与触发元素间距
const EDGE = 8;  // 视口左右最小边距
const ARROW = 8; // 箭头占位（三角 8px）

/**
 * 浮层定位组合式函数（供 DmSelect / DmDropdown / DmTooltip / DmPopover 共用）
 *
 * 用法：
 *   const { panelRef, panelStyle, arrowClass, arrowStyle, open, close } = usePopupPosition(
 *     triggerRef,
 *     () => ({ placement: props.placement, matchWidth: true, gap: 4, arrow: true })
 *   );
 *   // 打开浮层：open() —— 等 v-if 渲染完成后自动测量定位，并监听滚动/缩放
 *   // 关闭浮层：close()
 *
 * placement 支持 12 方向：top / bottom / left / right 及四角组合（topLeft、rightBottom 等）。
 * 空间不足时自动翻转主轴方向；arrow 为 true 时输出箭头的边（arrowClass）与偏移（arrowStyle）。
 */
export function usePopupPosition(triggerRef, getOptions) {
  const panelRef = ref(null);
  const panelStyle = reactive({
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    minWidth: undefined,
  });
  const arrowClass = ref('');                 // 箭头贴浮层的边：top / bottom / left / right
  const arrowStyle = reactive({ left: undefined, top: undefined });
  const actualPlacement = ref('');            // 实际放置方向（含翻转后）

  let listening = false;

  function getEl(refVal) {
    if (!refVal) return null;
    return refVal.$el || refVal;
  }

  function update() {
    const trigger = getEl(triggerRef.value);
    const panel = panelRef.value;
    if (!trigger || !panel) return;

    const { placement = 'bottomLeft', matchWidth = false, gap = GAP, arrow = false } = getOptions() || {};
    const rect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const g = arrow ? gap + ARROW : gap;
    const isVertical = /^(top|bottom)/.test(placement);

    // 重置箭头偏移，避免方向切换后残留
    arrowStyle.left = undefined;
    arrowStyle.top = undefined;

    if (isVertical) {
      // ---- 垂直主轴：优先按 placement，空间不足且对侧空间足够时翻转 ----
      let below = !placement.startsWith('top');
      const spaceBottom = window.innerHeight - rect.bottom;
      const spaceTop = rect.top;
      if (below && spaceBottom < panelRect.height + g && spaceTop > panelRect.height + g) {
        below = false;
      } else if (!below && spaceTop < panelRect.height + g && spaceBottom > panelRect.height + g) {
        below = true;
      }

      // 水平对齐：*Left → 左对齐；*Right → 右对齐；top/bottom/*Center → 居中
      let left = rect.left;
      if (placement.endsWith('Center') || placement === 'top' || placement === 'bottom') {
        left = rect.left + rect.width / 2 - panelRect.width / 2;
      } else if (placement.endsWith('Right')) {
        left = rect.left + rect.width - panelRect.width;
      }
      left = Math.max(EDGE, Math.min(left, window.innerWidth - panelRect.width - EDGE));

      panelStyle.left = `${left}px`;
      panelStyle.top = `${below ? rect.bottom + g : rect.top - panelRect.height - g}px`;
      panelStyle.minWidth = matchWidth ? `${rect.width}px` : undefined;

      if (arrow) {
        arrowClass.value = below ? 'top' : 'bottom';
        const cx = rect.left + rect.width / 2 - left;
        arrowStyle.left = `${Math.max(12, Math.min(cx, panelRect.width - 12)) - ARROW / 2}px`;
        if (!below) arrowStyle.top = `${panelRect.height - 2}px`; // 箭头贴底边（2px 叠入 panel 内）
      }
      actualPlacement.value = below ? 'bottom' : 'top';
    } else {
      // ---- 水平主轴：left* / right* / left / right ----
      let right = placement.startsWith('right');
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      if (right && spaceRight < panelRect.width + g && spaceLeft > panelRect.width + g) {
        right = false;
      } else if (!right && spaceLeft < panelRect.width + g && spaceRight > panelRect.width + g) {
        right = true;
      }

      // 垂直对齐：*Top → 顶对齐；*Bottom → 底对齐；left/right → 居中
      let top;
      if (placement.endsWith('Top')) {
        top = rect.top;
      } else if (placement.endsWith('Bottom')) {
        top = rect.top + rect.height - panelRect.height;
      } else {
        top = rect.top + rect.height / 2 - panelRect.height / 2;
      }
      top = Math.max(EDGE, Math.min(top, window.innerHeight - panelRect.height - EDGE));

      panelStyle.left = `${right ? rect.right + g : rect.left - panelRect.width - g}px`;
      panelStyle.top = `${top}px`;
      panelStyle.minWidth = undefined;

      if (arrow) {
        arrowClass.value = right ? 'left' : 'right';
        const cy = rect.top + rect.height / 2 - top;
        arrowStyle.top = `${Math.max(12, Math.min(cy, panelRect.height - 12)) - ARROW / 2}px`;
        if (!right) arrowStyle.left = `${panelRect.width - 2}px`;
      }
      actualPlacement.value = right ? 'right' : 'left';
    }
  }

  const onReposition = () => update();

  function startListen() {
    if (listening) return;
    listening = true;
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
  }

  function stopListen() {
    if (!listening) return;
    listening = false;
    window.removeEventListener('scroll', onReposition, true);
    window.removeEventListener('resize', onReposition);
  }

  /** 打开浮层时调用：等待渲染完成后定位并开始监听 */
  function open() {
    startListen();
    return nextTick(update);
  }

  /** 关闭浮层时调用：停止监听 */
  function close() {
    stopListen();
  }

  onBeforeUnmount(stopListen);

  return { panelRef, panelStyle, arrowClass, arrowStyle, actualPlacement, open, close };
}
