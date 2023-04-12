export const border_missing1 = `10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 5 - - - - - #
# + + + + + + . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 .
# # # # # # # # # #`

export const border_missing2 =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 5 - - - - - #
# + + + + + + . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 #
# # # # . # # # # #`

export const border_missing3 =`10
10
# # # # . # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 5 - - - - - #
# + + + + + + . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const invalid_columns =`10
11
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . . . . . . #
# . # . . . . . . #
# . . 5 . . . . . #
# + + + + + 5 . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const invalid_rows =`12
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . . . . . . #
# . # . . . . . . #
# . . 5 . . . . . #
# + + + + + 5 . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const invalid_swarm1 =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 5 - - - - - #
# + + + . + 5 . . #
# + + + . + + # . #
# + + + . + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`


export const invalid_swarm2 =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - . - - - #
# . # - - . - - - #
# . . 5 - . - - - #
# + + + . + 5 . . #
# + + + + + + # . #
# + + + . + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const invalid_value =`10
10
# # # # # # # # # #
# a 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 10 - - - - - #
# + + + + + 5 . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 0 9 #
# # # # # # # # # #`

export const minus_missing =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . . . . . . #
# . # . . . . . . #
# . . 5 . . . . . #
# + + + + + 5 . . #
# + + + + + + # . #
# + + + + + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const plus_missing =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . . . . . . #
# . # . . . . . . #
# . . 5 . . . . . #
# - - - - - 5 . . #
# - - - - - - # . #
# - - - - - . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const normal_map =`10
10
# # # # # # # # # #
# 9 9 . . . . 3 3 #
# 9 # . - - - - - #
# . # - - - - - - #
# . . 5 - - - - - #
# + + + . + 5 . . #
# + + + + + + # . #
# + + + . + . # 9 #
# 3 3 . . . . 9 9 #
# # # # # # # # # #`

export const non_existent = `sense ahead 1 3 food ; [ 0]
move 2 0 ; [ 1]
pickup 8 0 ; [ 2]
flip 3 4 5 ; [ 3]
turn left 0 ; [ 4]
flip 2 6 1223674 ; [ 5]
turn right 0 ; [ 6]
move 0 3 ; [ 7]
sense ahead 9 11 home ; [ 8]
move 10 8 ; [ 9]
drop 0 ; [10]
flip 3 12 13 ; [11]
turn left 8 ; [12]
flip 2 14 15 ; [13]
turn right 8 ; [14]
move 8 11 ; [15]`

export const invalid_token = `sense unrecognizable_word 1 3 food; [ 0]
move 2 0 ; [ 1]
pickup 8 0 ; [ 2]
flip 3 4 5 ; [ 3]
turn left 0 ; [ 4]
flip 2 6 7 ; [ 5]
turn right 0 ; [ 6]
move 0 3 ; [ 7]
sense ahead 9 11 home ; [ 8]
move 10 8 ; [ 9]
drop 0 ; [10]
flip 3 12 13 ; [11]
turn left 8 ; [12]
flip 2 14 15 ; [13]
turn right 8 ; [14]
move 8 11 ; [15]`

export const missing_token = `sense ahead 1 3 food ; [ 0]
move 2 ; [ 1] absent value
pickup 8 0 ; [ 2]
flip 3 4 5 ; [ 3]
turn left 0 ; [ 4]
flip 2 6 7 ; [ 5]
turn right 0 ; [ 6]
move 0 3 ; [ 7]
sense ahead 9 11 home ; [ 8]
move 10 8 ; [ 9]
drop 0 ; [10]
flip 3 12 13 ; [11]
turn left 8 ; [12]
flip 2 14 15 ; [13]
turn right 8 ; [14]
move 8 11 ; [15]`

export const normal_assembler = `sense ahead 1 3 food ; [ 0]
move 2 0 ; [ 1]
pickup 8 0 ; [ 2]
flip 3 4 5 ; [ 3]
turn left 0 ; [ 4]
flip 2 6 1 ; [ 5]
turn right 0 ; [ 6]
move 0 3 ; [ 7]
sense ahead 9 11 home ; [ 8]
move 10 8 ; [ 9]
drop 0 ; [10]
flip 3 12 13 ; [11]
turn left 8 ; [12]
flip 2 14 15 ; [13]
turn right 8 ; [14]
move 8 11 ; [15]`