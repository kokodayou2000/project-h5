<script lang="ts" setup>
interface IProps {
  showAction?: boolean
  background?: string
  placeholder?: string
  shape?: string
  modelValue?: string | number
}

// 参数对象
const props = defineProps<IProps>()

// 事件声明
interface IEmits {
  // 事件 search
  (e: 'search', v?: string | number): void

  // 事件 cancel
  (e: 'cancel'): void

  // 事件 clear
  (e: 'clear'): void

  // 事件 update:modelValue 向组件中输入数据的时候
  (e: 'update:modelValue', v?: string | number): void

  // 用户点击搜索栏，会进行页面切换
  (e: 'inputClick'): void
}

// 事件对象
const emits = defineEmits<IEmits>()

const onKeydown = (e: KeyboardEvent) => {
  if (e.code === 'Enter') {
    // 禁止键盘的默认事件
    e.preventDefault()
    // 搜索框的值
    emits('search', props.modelValue)
  }
}
const onClear = () => {
  // 清空值
  emits('update:modelValue', '')
  // 清除
  emits('clear')
}
</script>

<template>
  <!--  BEM 写法-->
  <div :class="{ 'op-search--show-action': showAction }" :style="{ background }" class="op-search">
    <!-- 边角弧度 -->
    <div :class="shape ? `op-search__content--${shape}` : ''" class="op-search__content">
      <div class="op-cell op-search__field">
        <div class="op-field__left-icon">
          <VanIcon name="search" />
        </div>
        <div class="op-cell__value">
          <div class="op-field__body">
            <input
              :placeholder="placeholder"
              :value="modelValue"
              class="op-field__control"
              type="search"
              @click="emits('inputClick')"
              @input="(e) => emits('update:modelValue', (e.target as HTMLInputElement).value)"
              @keydown="onKeydown"
            />
            <!--  用户是否设置了 right-icon -->
            <div v-if="$slots['right-icon']" class="op-field__right-icon">
              <slot name="right-icon"></slot>
            </div>
            <!-- VanIcon 只有当没有设置 right-icon 并且 用户以及输入数据的时候，才会出现 -->
            <VanIcon
              v-else-if="modelValue"
              class="op-field__clear"
              name="clear"
              @click="onClear"
            ></VanIcon>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAction" class="op-search__action">
      <slot name="action">
        <div @click="emits('cancel')">取消</div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
// css变量
:root {
  --op-search-padding: 10px var(--van-padding-sm);
  --op-search-background-color: var(--van-background-color-light);
  --op-search-content-background: var(--van-gray-1);
  --op-search-left-icon-color: var(--van-gray-6);
  --op-search-action-padding: 0 var(--van-padding-xs);
  --op-search-action-text-color: var(--van-text-color);
  --op-search-action-font-size: var(--van-font-size-md);
  --op-search-input-height: 34px;
}

.op-search {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: var(--op-search-padding);
  background: var(--op-search-background-color);

  &--show-action {
    padding-right: 0;
  }

  &__content {
    display: flex;
    flex: 1;
    padding-left: var(--van-padding-sm);
    background: var(--op-search-content-background);
    border-radius: var(--van-border-radius-sm);

    &--round {
      border-radius: var(--van-radius-max);
    }
  }

  &__action {
    padding: var(--op-search-action-padding);
    color: var(--op-search-action-text-color);
    font-size: var(--op-search-action-font-size);
    line-height: var(--op-search-input-height);
    cursor: pointer;
    user-select: none;
  }

  &__field {
    flex: 1;
    padding: 5px var(--van-padding-xs) 5px 0;
    background-color: transparent;

    .op-field__left-icon {
      color: var(--op-search-left-icon-color);
      margin-right: var(--van-padding-base);

      .van-icon {
        font-size: var(--van-field-icon-size);
      }
    }
  }
}

.op-cell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  color: var(--van-cell-text-color);
  font-size: var(--van-cell-font-size);
  line-height: var(--van-cell-line-height);

  &__value {
    flex: 1;
    color: var(--van-cell-text-color);
    vertical-align: middle;
    word-wrap: break-word;
  }
}

.op-field {
  &__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    color: var(--van-field-input-text-color);
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    resize: none;
    user-select: none;

    &::placeholder {
      color: var(--van-field-placeholder-text-color);
    }
  }

  &__body {
    display: flex;
    align-items: center;
  }

  &__right-icon {
    color: var(--van-field-right-icon-color);
    padding: 0 var(--van-padding-xs);
    line-height: inherit;
    flex-shrink: 0;
  }

  &__clear {
    color: var(--van-field-clear-icon-color);
    font-size: var(--van-field-clear-icon-size) !important;
    cursor: pointer;
  }
}

input {
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }
}
</style>
