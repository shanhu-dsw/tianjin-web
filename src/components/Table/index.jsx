/* eslint-disable indent */
import './index.scss'

export default {
  name: 'CustomTable',
  props: {
    data: {
      type: Array,
      default: () => [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          email: '2222'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          email: 'xxxx'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          email: 'dddd'
        }
      ]
    },
    columns: {
      type: Array,
      default: () => [
        { prop: 'date', label: '日期', align: 'center' },
        { prop: 'name', label: '姓名', align: 'center' },
        { prop: 'address', label: '地址', align: 'center' },
        {
          prop: 'email',
          label: '邮箱',
          align: 'center',
          component: {
            name: 'email',
            props: ['column'],
            render() {
              return <div>自定义组件</div>
            }
          }
        }
        // // 模版中的元素需要对应的有 slot="opt" 属性
        // { slot: 'opt1', label: '输入', align: 'center' },
        // { slot: 'opt', label: '操作', align: 'center' }
      ]
    },
    loading: {
      type: Boolean,
      default: false
    },
    spanMethod: {
      type: Function,
      default: () => {}
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function,
      default: () => {}
    },
    tHeight: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      tableHeight: 0
    }
  },
  mounted() {
    this.tableHeight = this.tHeight
      ? this.tHeight
      : this.$refs.tableContainer.offsetHeight - 20
  },
  methods: {
    getAttrs(h, column) {
      const self = this
      const scopedSlots =
        column.slot || column.render || column.component
          ? {
              scopedSlots: {
                default(scope) {
                  const exportVal = {
                    column: scope.column,
                    $index: scope.$index,
                    row: scope.row
                  }
                  if (column.slot) {
                    return self.$scopedSlots[column.slot](exportVal)
                  } else if (column.render) {
                    return column.render(h, exportVal)
                  } else if (column.component) {
                    return h(column.component)
                  }
                }
              }
            }
          : {}

      return {
        ...scopedSlots,
        attrs: {
          ...column,
          'show-overflow-tooltip': true,
          align: column.align || 'center'
        }
      }
    }
  },
  render(h) {
    const directives = {
      directives: [{ name: 'loading', value: this.loading }]
    }
    const listeners = {
      on: {
        'row-click': (row, column, event) =>
          this.$emit('row-click', row, column, event),
        'selection-change': (row) => this.$emit('selection-change', row)
      }
    }

    return (
      <div class="custom-table-container" ref="tableContainer">
        {this.tableHeight ? (
          <el-table
            height={`${this.tableHeight}px`}
            stripe
            {...{ attrs: this.$attrs }}
            {...{ props: this.$props }}
            {...directives}
            {...listeners}
            class={{ 'base-table': true, 'mb-2': true }}
            ref="table"
          >
            {this.columns.map((column) => {
              return (
                <el-table-column
                  key={column.prop}
                  {...this.getAttrs(h, column)}
                >
                  {column.children &&
                    column.children.map((c) => {
                      return (
                        <el-table-column
                          key={c.prop}
                          {...this.getAttrs(h, c)}
                        />
                      )
                    })}
                </el-table-column>
              )
            })}
          </el-table>
        ) : (
          ''
        )}
      </div>
    )
  }
}
