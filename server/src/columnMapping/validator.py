MAX_COLUMN_LABEL_LENGTH = 80


class ColumnMappingValidator:
    def validate_column_label(self, columnLabel) -> bool:
        if not isinstance(columnLabel, str):
            return False

        columnLabelLen = len(columnLabel)
        if columnLabelLen == 0:
            return False

        return columnLabelLen <= MAX_COLUMN_LABEL_LENGTH
