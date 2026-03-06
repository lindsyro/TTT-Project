<template>
  <div class="board">
    <div v-for="(row, rIdx) in board.field" :key="rIdx" class="board-row">
      <div
        v-for="(cell, cIdx) in row"
        :key="cIdx"
        class="cell"
        :class="{
          disabled: disabled || board.winningLine,
          winner: board.isWinningCell(rIdx, cIdx),
          'cell-x': cell === 1,
          'cell-o': cell === 2,
        }"
        @click="onClick(rIdx, cIdx)"
      >
        <transition name="zoom">
          <span :key="cell">
            {{ cell !== 0 ? props.icons[cell] : '' }}
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BoardModel } from '@/models/board.model'

const props = defineProps<{
  data: BoardModel
  disabled: boolean
  icons: Record<number, string>
}>()

const board = computed(() => props.data)

const emit = defineEmits<{
  (e: 'move', payload: { row: number; col: number }): void
}>()

const onClick = (row: number, col: number) => {
  if (!props.disabled && board.value.field[row]?.[col] === 0) {
    emit('move', { row, col })
  }
}
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: auto;
}
.board-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}
.cell {
  width: 100px;
  height: 100px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: background-color 0.3s;
}
.cell:hover:not(.disabled) {
  background-color: #ddd;
}
.cell-x {
  color: #d9534f;
}
.cell-o {
  color: #2078cb;
}
.disabled {
  cursor: not-allowed;
}
/* Анимация */
.zoom-enter-active {
  animation: zoom-in 0.2s;
}
@keyframes zoom-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.cell.winner {
  background-color: #ebf9f2 !important;
  z-index: 10;
}
</style>
