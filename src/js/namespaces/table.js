import basicValidators from './validation/basic-validators'
import basic from '../basic'

let tableNamespace = {
    /*
    * row {
    *   id: '',
    *   class: '',
    *   attr: {k1: 'v1', k2: 'v2'},
    *   columns: [
    *       {
    *           id: '',
    *           class: '',
    *           attr: {k3: 'v3', k4: 'v4'},
    *           data: '',
    *       },
    *   ],
    * }
    */
    addRows: function (table, rows) {
        table = basic.sis(table);
        if (!table.length)
            return;

        let rowList = [], singleRow, k;
        if (basicValidators.isArray(rows)) {
            let i = 0, l = rows.length, _row,
                j, m, col, _td;
            if (!l)
                return;
            for (; i < l; i++) {
                _row = rows[i];
                singleRow = $('<tr>').attr('id', _row.id).addClass(_row.class);

                if (_row.attr)
                    for (k in _row.attr)
                        if (_row.attr.hasOwnProperty(k))
                            singleRow.attr(k, _row.attr[k]);

                for (j = 0, m = _row.columns.length; j < m; j++) {
                    col = _row.columns[j];
                    _td = $('<td>').attr('id', col.id).addClass(col.class).html(col.data);
                    if (col.attr)
                        for (k in col.attr)
                            if (col.attr.hasOwnProperty(k))
                                _td.attr(k, col.attr[k]);
                    singleRow.append(_td);
                }
                rowList.push(singleRow[0]);
            }
        }
        else {
            singleRow = $('<tr>')
                .attr('id', rows.id)
                .addClass(rows.class);
            if (rows.attr)
                for (k in rows.attr)
                    if (rows.attr.hasOwnProperty(k))
                        singleRow.attr(k, rows.attr[k]);

            for (let j = 0, m = rows.columns.length; j < m; j++) {
                let col = rows.columns[j],
                    _td = $('<td>').attr('id', col.id).addClass(col.class).html(col.data);
                if (col.attr)
                    for (k in col.attr)
                        if (col.attr.hasOwnProperty(k))
                            _td.attr(k, col.attr[k]);
                singleRow.append(_td);
            }
            rowList.push(singleRow[0]);
        }

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) {
            if (rowList.length > 1)
                table.DataTable().rows.add(rowList);
            else
                table.DataTable().row.add(rowList[0]);

            table.DataTable().columns.adjust().draw();
        }
        else
            table.find('tbody').append(rowList);


        tableNamespace.updatePaginationTotal(rowList.length);
        return rowList.length === 1 ? rowList[0] : rowList;
    },
    removeRows: function (table, rows) {
        table = basic.sis(table);

        if (!table.length)
            return;

        rows = table.find('tbody').find(rows);

        if (!rows.length)
            return;

        if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) {
            if (rows.length > 1)
                table.DataTable().rows(rows).remove().draw();
            else
                table.DataTable().row(rows).remove().draw();
        }
        else
            rows.remove();

        tableNamespace.updatePaginationTotal(-rows.length);
        return rows;
    },
    removeChecked: function (table, inputName) {
        table = basic.sis(table);

        if (!table.length)
            return;

        let r = table.find('input[name="' + inputName + '"]:checked').closest('tr');
        if (!r.length)
            return;
        return tableNamespace.removeRows(table, r);
    },
    removeAll: function (table) {
        table = basic.sis(table);
        if (!table.length)
            return;
        let result = table.find('tbody').find('tr');
        if ($.fn.DataTable && $.fn.DataTable.isDataTable(table))
            table.DataTable().rows(result).remove().draw();
        else
            result.remove();

        tableNamespace.updatePaginationTotal(-result.length);
        return result;
    },
    moveRows: function (from, to, rows) {
        let r = tableNamespace.removeRows(from, rows);
        if (!r.length)
            return;
        to = basic.sis(to);
        if (!to.length)
            return;
        if ($.fn.DataTable && $.fn.DataTable.isDataTable(to)) {
            if (r.length > 1)
                to.DataTable().rows.add(r).draw();
            else
                to.DataTable().row.add(r).draw();
        }
        else
            to.find('tbody').append(r);
        return r;
    },
    moveChecked: function (from, to, inputName) {
        let r = tableNamespace.removeChecked(from, inputName);
        if (!r.length)
            return;
        to = basic.sis(to);
        if (!to.length)
            return;
        if ($.fn.DataTable && $.fn.DataTable.isDataTable(to)) {
            if (r.length > 1)
                to.DataTable().rows.add(r).draw();
            else
                to.DataTable().row.add(r).draw();
        }
        else
            to.find('tbody').append(r);
        r.find(inputName).prop("checked", false);
        return r;
    },
    count: function (table, rows) {
        table = basic.sis(table);
        if (!table.length)
            return;
        if ($.fn.DataTable && $.fn.DataTable.isDataTable(table))
            return rows
                ? table.DataTable().rows(rows).count()
                : table.DataTable().data().count();
        else
            return rows
                ? table.find('tbody').find(rows).length
                : table.find('tbody').find('tr').length;
    },

    updatePaginationTotal: function (value, rowCountElement) {
        rowCountElement = rowCountElement ? basic.sis(rowCountElement) : $('#pagination').find('.total');
        if (rowCountElement.length) {
            let oldCount = 0;
            try {
                oldCount = parseInt(rowCountElement.text());
            }
            catch (ex) {
            }
            let newCount = oldCount + value;
            rowCountElement.text(newCount);
            return newCount;
        }
        return -1;
    }
};

export default tableNamespace