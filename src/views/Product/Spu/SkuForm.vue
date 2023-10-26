<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input placeholder="重量(g)"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="sku描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline="true">
          <el-form-item label="手机一级">
            <el-select>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机一级">
            <el-select>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机一级">
            <el-select>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
              <el-option label="安卓"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-input placeholder="销售属性"></el-input>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border>
          <el-table-column type="selection" width="80px" align="center"></el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
const $emit = defineEmits(['changeScene'])
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
</script>
<style scoped></style>
