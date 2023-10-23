<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="spu名称">
        <el-input placeholder="请输入SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="spu品牌">
        <el-select>
          <el-option label="华为"></el-option>
          <el-option label="小米"></el-option>
          <el-option label="OPPO"></el-option>
          <el-option label="vivo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input type="textarea" placeholder="请输入Spu描述"></el-input>
      </el-form-item>
      <el-form-item label="spu照片">
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="spu销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select>
          <el-option label="华为"></el-option>
          <el-option label="小米"></el-option>
          <el-option label="OPPO"></el-option>
          <el-option label="vivo"></el-option>
        </el-select>
        <el-button icon="plus" type="primary" style="margin-left: 10px">添加属性值</el-button>
        <!-- 展示销售属性与属性值 -->
        <el-table border style="margin: 10px 0">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名字" width="120px"></el-table-column>
          <el-table-column label="属性值"></el-table-column>
          <el-table-column label="操作" width="120px"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
const $emits = defineEmits(['changeScene'])

//点击取消按钮：通知父组件切换场景1， 展示有的Spu
const cancel = () => {
  $emits('changeScene', 0)
}
</script>
<style scoped></style>
