<template>
   <div>
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
       </el-breadcrumb>
       <!-- 卡片视图区域 -->
       <el-card>
           <el-row :gutter="20">
               <!-- 搜索框 -->
               <el-col :span="8">
                   <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
               </el-col>
               <!-- 添加按钮 -->
               <el-col :span="4">
                   <el-button type="primary" @click="goAddPage">添加商品</el-button>
               </el-col>
           </el-row>
           <!-- 商品列表 -->
            <el-table
                :data="goodslist"
                style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column width="95" prop="goods_price" label="商品价格(元)"></el-table-column>
                <el-table-column width="75" prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column width="140" prop="add_time" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.add_time | datFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <template slot-scope="scope">
                        <!-- 编辑 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <!-- 删除按钮 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 15, 17, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
           
       </el-card>
   </div>
</template>
<script>
export default {
    data() {
        return {
            // 商品列表请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            // 商品列表数据
            goodslist:[],
            // 总页数
            total:0,
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        async getGoodsList() {
            const {data:res}= await this.$http.get('goods',{
                params:this.queryInfo
            })
            if(res.meta.status!==200) {
                return this.$message.error('获取商品列表失败')
            }
            this.$message.success('获取商品列表成功')
            console.log(res.data)
            this.goodslist=res.data.goods
            this.total=res.data.total
        },
        // 监听pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum=newPage
            this.getGoodsList()
        },
        // 根据id，删除商品
        async removeById(id) {
            const confirmResult= await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(confirmResult!=='confirm'){
                return this.$message.info('取消了删除')
            }
            const {data:res}= await this.$http.delete(`goods/${id}`)
            if(res.meta.status!==200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        // 跳转到添加商品页面
        // 商品的名称必须是唯一的
        goAddPage(){
            this.$router.push('/goods/add')
        }
    }
}
</script>
<style lang="less" scoped>

</style>