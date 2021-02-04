<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
        >一括削除</el-button>
        <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
          <el-option key="1" label="广东省" value="广东省" />
          <el-option key="2" label="湖南省" value="湖南省" />
        </el-select> -->
        <el-input v-model="query.name" placeholder="名前で検索" class="handle-input mr10" />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">検索</el-button>
        <el-button type="success" icon="el-icon-s-check" @click="handleSearch">技術者</el-button>
        <el-button type="success" icon="el-icon-s-custom" @click="handleSearch">管理営業</el-button>
        <el-button type="success" icon="el-icon-user-solid" @click="handleSearch">総務</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <el-table-column prop="name" label="名前">
          <template slot-scope="scope">
            <span>{{ scope.row.firstName + ' ' + scope.row.lastName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性別">
          <template slot-scope="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <!-- <template slot-scope="scope">￥{{ scope.row.money }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            />
          </template>
        </el-table-column> -->
        <el-table-column prop="email" label="メール">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="telNo" label="電話番号">
          <template slot-scope="scope">
            <span>{{ scope.row.telNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状態" />
        <!-- <el-table-column label="電話番号" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
            >{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >編集</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >削除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="編集" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">キャンセル</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Basetable',
  data() {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      request.get('/member/allList')
        .then(response => {
          console.log(response.data)
          this.tableData = response.data
          // console.log(this.tableData)
          this.pageTotal = response.pageTotal || 50
        })
        .catch(error => {
          console.log(error)
        })
    },

    handleSearch() {
      this.$set(this.query, 'pageIndex', 1)
      this.getData()
    },

    handleDelete(index, row) {
      this.$confirm('本当に削除しますか？', '注意', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delAllSelection() {
      const length = this.multipleSelection.length
      let str = ''
      this.delList = this.delList.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error(`删除了${str}`)
      this.multipleSelection = []
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false
      this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.$set(this.tableData, this.idx, this.form)
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val)
      this.getData()
    }
  }
}
</script>

<style scoped>
.container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.crumbs {
    margin: 10px 0;
}

.el-table th {
    background-color: #f5f7fa !important;
}

.pagination {
    margin: 20px 0;
    text-align: right;
}

.plugins-tips {
    padding: 20px 10px;
    margin-bottom: 20px;
}

.el-button+.el-tooltip {
    margin-left: 10px;
}

.el-table tr:hover {
    background: #f6faff;
}

.mgb20 {
    margin-bottom: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
