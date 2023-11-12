<script lang="ts" setup>
import OpSearch from '@/components/OpSearch.vue'
import { computed, ref, watch } from 'vue'
import { fetchSearchData } from '@/api/search'
import type { ISearchResult } from '@/types'
import { useToggle } from '@/use/useToggle'
import { useDebounce } from '@/use/useDebounce'

interface IEmits {
  (e: 'cancel'): void
}

const emits = defineEmits<IEmits>()

enum status {
  unSearch,
  searching,
  searched,
}

const searchValue = ref('')
const searchResult = ref([] as ISearchResult[])
const searchState = ref(status.unSearch)

const HISTORY_TAGS = ['比萨', '栗子', '炒饭', '玉米', '牛腩', '芝士', '水果', '烧烤']

const [isHistoryTagShown, toggleHistoryTag] = useToggle(false)

const historyTags = computed(() =>
  isHistoryTagShown.value ? HISTORY_TAGS : HISTORY_TAGS.slice(0, 5),
)

const onSearch = async (v?: string | number) => {
  try {
    searchState.value = status.searching
    const { list } = await fetchSearchData(v as string)
    searchResult.value = list
  } finally {
    searchState.value = status.searched
  }
}

const onTagClick = (v: string) => {
  searchValue.value = v
  onSearch(v)
}

// watch(
//   searchValue,
//   useDebounce((nv) => {
//     if (!nv) {
//       searchResult.value = []
//       return
//     }
//     onSearch(nv as string)
//   }, 1000),
// )

const debounceValue = useDebounce(searchValue, 1000)
watch(debounceValue, (nv) => {
  if (!nv) {
    searchResult.value = []
    return
  }
  onSearch(nv)
})
</script>

<template>
  <div class="search-view">
    <OpSearch
      v-model="searchValue"
      placeholder="搜索"
      shape="round"
      show-action
      @cancel="emits('cancel')"
      @search="onSearch"
    ></OpSearch>
    <div v-if="!searchValue" class="search-view__history">
      <div class="label">历史搜索</div>
      <TransitionGroup name="list">
        <div v-for="v in historyTags" :key="v" class="history-tag" @click="onTagClick(v)">
          {{ v }}
        </div>
        <div key="tag" class="history-tag" @click="toggleHistoryTag">
          <VanIcon v-if="isHistoryTagShown" name="arrow-up" />
          <VanIcon v-else name="arrow-down" />
        </div>
      </TransitionGroup>
    </div>
    <div v-else class="search-view__result">
      <!--  正在搜索中 -->
      <div v-if="searchState === status.searching" class="searching">正在搜索中...</div>
      <!--   搜索结束   -->
      <template v-if="searchState === status.searched">
        <div v-for="v in searchResult" :key="v.label" class="result-item">
          <VanIcon name="search"></VanIcon>
          <div class="name">{{ v.label }}</div>
          <div class="count">{{ v.resultCount }}</div>
        </div>
        <div v-if="searchResult.length === 0" class="no-result">暂无推荐</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.search-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;

  &__history {
    padding: var(--van-padding-sm);

    .label {
      margin-bottom: var(--van-padding-xs);
    }

    .history-tag {
      display: inline-block;
      font-size: 12px;
      border-radius: 10px;
      color: var(--van-gray-6);
      background: var(--van-gray-1);
      padding: 4px 8px;
      margin-right: 10px;
      margin-bottom: var(--van-padding-xs);
    }
  }

  &__result {
    .result-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 10px;
      border-radius: 1px solid var(--van-gray-1);

      .name {
        flex: 1;
        padding-left: 6px;
      }

      .count {
        font-size: 12px;
        color: var(--van-gray-6);
      }
    }

    .no-result,
    .searching {
      font-size: 12px;
      padding: 100px 0;
      text-align: center;
      color: var(--van-gray-6);
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
