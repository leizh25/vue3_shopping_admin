<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select>
          <el-option value="1">北京</el-option>
          <el-option value="12">上海</el-option>
          <el-option value="13">广州</el-option>
          <el-option value="14">深圳</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option value="1">北京</el-option>
          <el-option value="12">上海</el-option>
          <el-option value="13">广州</el-option>
          <el-option value="14">深圳</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option value="1">北京</el-option>
          <el-option value="12">上海</el-option>
          <el-option value="13">广州</el-option>
          <el-option value="14">深圳</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts"></script>
<style scoped></style>
