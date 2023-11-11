<script lang="ts" setup>
import type { ISearchRecommend } from '@/types'
import OpSearch from '@/components/OpSearch.vue'

interface IProps {
  recommends: ISearchRecommend[]
}

defineProps<IProps>()

interface IEmits {
  (e: 'searchClick'): void
}

const emits = defineEmits<IEmits>()
</script>

<template>
  <div class="home-top">
    <div class="top">
      <img class="location-icon" src="@/assets/imgs/index_page/local.png" />
      <div class="location">镜湖广场</div>
      <img class="shopCart-icon" src="@/assets/imgs/index_page/shopping.png" />
      <img class="comments-icon" src="@/assets/imgs/index_page/message-one.png" />
    </div>
    <OpSearch
      background="linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243))"
      placeholder="烤鸡腿"
      shape="round"
      @inputClick="emits('searchClick')"
    >
      <template #right-icon>
        <div @click="emits('searchClick')">搜索</div>
      </template>
    </OpSearch>
    <div class="search-recommend">
      <div v-for="v in recommends" :key="v.value" class="tag">
        {{ v.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-top {
  background: linear-gradient(to right, rgb(53, 200, 2500), rgb(31, 175, 243));
  color: white;

  .top {
    display: flex;
    align-items: center;
    padding: 10px 10px 0 10px;
    line-height: 15px;
    font-size: 15px;
    font-weight: bold;

    .location-icon {
      width: 24px;
      height: 24px;
    }

    .location {
      flex: 1;
    }

    .shopCart-icon {
      width: 24px;
      height: 24px;
    }

    .comments-icon {
      width: 24px;
      height: 24px;
      margin-top: 4px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  .search-recommend {
    display: flex;
    padding: 0 10px 8px;

    .tag {
      font-size: 10px;
      border-radius: 10px;
      background: rgb(242, 242, 242, 0.3);
      padding: 2px 8px;
      margin-right: 10px;
    }
  }
}
</style>
<!-- 在没有scope的标签中重写 vant ui -->
<style lang="scss">
.home-top {
  .van-field__right-icon {
    margin-right: 0;
  }
}
</style>
