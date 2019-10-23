<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类列表区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#"
        :show-row-hover="false"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i style="color:lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
          <i style="color:red" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">标签一</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">标签二</el-tag>
          <el-tag size="mini" type="warning" v-else>标签三</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 可选项数据源 -->
          <!-- props 配置选项 -->
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentHandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求查询参数
      queryInfo: {
        // 获取三级分类
        type: 3,
        // 当前页
        pagenum: 1,
        // 每页的条数
        pagesize: 5
      },
      // 商品分类列表数据
      cateList: [],
      // 总页数
      total: 0,
      // 为table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板
          type: 'template',
          // 当前列模板的名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板
          type: 'template',
          // 当前列模板的名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板
          type: 'template',
          // 当前列模板的名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateFrom: {
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        // 分类当前层级
        cat_level: 0
      },
      // 添加分类表单的验证对象
      addCateFromRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表数据
      parentCateList: [],
      // 可选项数据源
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      // 选中的父级分类Id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res.data)
      // api接口不对
      // if(res.mate.st!==200) {
      //   return this.$message.error('获取商品分类列表失败')
      // }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize 事件
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getCateList()
    },
    // 监听pagenum 事件
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getCateList()
    },
    // 点击添加分类按钮，展示添加分类对话框
    showAddCate() {
      // 先获取父级分类数据
      this.getParentCateList()
      // 再展示添加分类对话框
      this.addCateDialogVisible = true
    },
    // 获取父级列表的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表数据失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentHandleChange() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类层级
        this.addCateFrom.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateFrom.cat_pid = 0
        // 分类层级
        this.addCateFrom.cat_level = 0
      }
    },
    // 点击按钮，添加分类
    addCate() {
      console.log(this.addCateFrom)
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) reutrn
        const { data: res } = await this.$http.post('categories', this.addCateFrom)
        console.log(res.data)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClose() {
      this.$refs.addCateFromRef.resetFields()
      this.selectedKeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>