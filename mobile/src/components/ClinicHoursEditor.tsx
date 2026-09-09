import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  CLINIC_WEEKDAYS,
  applyWeekdayTemplate,
  formatClinicHoursCompactSummary,
  dateToTime,
  timeToDate,
  type ClinicDayHours,
  type ClinicHoursSchedule,
  type ClinicWeekdayId,
} from "../lib/clinic-hours";
import { Colors } from "../lib/colors";

type Props = {
  value: ClinicHoursSchedule;
  onChange: (next: ClinicHoursSchedule) => void;
  accent?: string;
  legacyText?: string | null;
};

type PickerTarget = {
  dayId: ClinicWeekdayId;
  field: "start" | "end";
};

export function ClinicHoursEditor({
  value,
  onChange,
  accent = Colors.primary,
  legacyText,
}: Props) {
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [draftDate, setDraftDate] = useState(() => timeToDate("09:00"));

  const daysById = useMemo(() => {
    const map = new Map<ClinicWeekdayId, ClinicDayHours>();
    for (const d of value.days) map.set(d.id, d);
    return map;
  }, [value.days]);

  function updateDay(id: ClinicWeekdayId, patch: Partial<ClinicDayHours>) {
    onChange({
      v: 1,
      days: value.days.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
  }

  function openPicker(dayId: ClinicWeekdayId, field: "start" | "end") {
    const day = daysById.get(dayId);
    if (!day) return;
    setDraftDate(timeToDate(field === "start" ? day.start : day.end));
    setPicker({ dayId, field });
  }

  function commitPicker(date: Date) {
    if (!picker) return;
    updateDay(picker.dayId, { [picker.field]: dateToTime(date) });
  }

  function onNativeChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        setPicker(null);
        return;
      }
      if (date) {
        commitPicker(date);
      }
      setPicker(null);
      return;
    }
    if (date) setDraftDate(date);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerText}>
          <Text style={styles.cardTitle}>Horario</Text>
          <Text style={styles.summary} numberOfLines={2}>
            {formatClinicHoursCompactSummary(value)}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            onChange(applyWeekdayTemplate(value, "09:00", "20:00"))
          }
          hitSlop={8}
        >
          <Text style={[styles.quickAction, { color: accent }]}>
            Plantilla L–V
          </Text>
        </Pressable>
      </View>

      {legacyText ? (
        <Text style={styles.legacyNote}>
          Horario anterior (texto libre): {legacyText}
          {"\n"}Configura los días abajo para sustituirlo.
        </Text>
      ) : null}

      {CLINIC_WEEKDAYS.map((meta, index) => {
        const day = daysById.get(meta.id);
        if (!day) return null;
        return (
          <View
            key={meta.id}
            style={[
              styles.row,
              index < CLINIC_WEEKDAYS.length - 1 && styles.rowBorder,
            ]}
          >
            <Text style={styles.dayLabel}>{meta.labelEs}</Text>
            <View style={styles.rowRight}>
              {day.open ? (
                <View style={styles.times}>
                  <Pressable
                    onPress={() => openPicker(meta.id, "start")}
                    style={styles.timeChip}
                  >
                    <Text style={styles.timeChipText}>{day.start}</Text>
                  </Pressable>
                  <Text style={styles.timeSep}>–</Text>
                  <Pressable
                    onPress={() => openPicker(meta.id, "end")}
                    style={styles.timeChip}
                  >
                    <Text style={styles.timeChipText}>{day.end}</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.closed}>Cerrado</Text>
              )}
              <Switch
                value={day.open}
                onValueChange={(open) => updateDay(meta.id, { open })}
                trackColor={{ false: "#E5E7EB", true: accent }}
                thumbColor="#fff"
              />
            </View>
          </View>
        );
      })}

      {picker && Platform.OS === "android" ? (
        <DateTimePicker
          value={draftDate}
          mode="time"
          is24Hour
          display="default"
          onChange={onNativeChange}
        />
      ) : null}

      {picker && Platform.OS === "ios" ? (
        <Modal transparent animationType="slide" visible>
          <Pressable style={styles.backdrop} onPress={() => setPicker(null)} />
          <View style={styles.sheet}>
            <View style={styles.sheetBar}>
              <Pressable onPress={() => setPicker(null)}>
                <Text style={styles.sheetCancel}>Cancelar</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>
                {picker.field === "start" ? "Apertura" : "Cierre"}
              </Text>
              <Pressable
                onPress={() => {
                  commitPicker(draftDate);
                  setPicker(null);
                }}
              >
                <Text style={[styles.sheetDone, { color: accent }]}>Listo</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={draftDate}
              mode="time"
              is24Hour
              display="spinner"
              onChange={onNativeChange}
              style={styles.spinner}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  headerText: { flex: 1, minWidth: 0, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  summary: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
  quickAction: { fontSize: 12, fontWeight: "700" },
  legacyNote: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    backgroundColor: "#FFFBEB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  dayLabel: { fontSize: 16, color: Colors.text, fontWeight: "500", flexShrink: 0 },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  times: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeChip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    fontVariant: ["tabular-nums"],
  },
  timeSep: { color: Colors.textSecondary, fontSize: 14 },
  closed: { fontSize: 14, color: Colors.textLight, fontWeight: "600" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingBottom: 24,
  },
  sheetBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  sheetCancel: { fontSize: 16, color: Colors.textSecondary },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  sheetDone: { fontSize: 16, fontWeight: "700" },
  spinner: { height: 180, alignSelf: "center" },
});
