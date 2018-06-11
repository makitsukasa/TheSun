# /-\@
# |s!g
# \_/w
#
# s : space
# g : goat
# w : wolf
#
# move tiles as 15puzzle, let goat in cage:
# /-\@
# |g|s
# \_/w
#
# upper-right 2 tiles (\ and @) are connected
#

from time import sleep

S = 0xA;
B1 = 0xB;
B2 = 0xC;
DIRECTIONS = [(0, 1), (0, -1), (1, 0), (-1, 0)]
DIRECTION_NAME = {
	(0, 1): 'D', (0, -1): 'U', (1, 0): 'R', (-1, 0): 'L'
}
TILE_MAP = [None, '/', '-', '|', '!', 'g', '\\', '_', '/', 'w', ' ', '\\', '@']

INIT_STATE = [1, 2, B1, B2, 3, S, 4, 5, 6, 7, 8, 9]
GOAL_STATE = [8, 2, B1, B2, 3, 5, 4, S, 6, 7, 1, 9]
#GOAL_STATE = [1, 7, B1, B2, 3, 5, 4, S, 6, 2, 8, 9]

class State:
	def __init__(self, state = None, prevState = None):
		if state is None:
			self.state = INIT_STATE
		else:
			self.state = state

		self.prevState = prevState
		if prevState is None:
			self.depth = 0
		else:
			self.depth = prevState.depth + 1

		self.posSpace = self.state.index(S)
		self.posBigTile = [i for i, x in enumerate(self.state) if x == B1 or x == B2]

	def getNextState(self, direction):
		if direction[0] == 0:
			if direction[1] == 1:
				# Down
				if self.posSpace < 4:
					return None
				if self.posSpace - 4 in self.posBigTile:
					return None
				newState = self.state[:]
				newState[self.posSpace] = self.state[self.posSpace - 4]
				newState[self.posSpace - 4] = self.state[self.posSpace]
				return State(newState, self)
			else:
				# Up
				if self.posSpace > 7:
					return None
				if self.posSpace + 4 in self.posBigTile:
					return None
				newState = self.state[:]
				newState[self.posSpace] = self.state[self.posSpace + 4]
				newState[self.posSpace + 4] = self.state[self.posSpace]
				return State(newState, self)
		else:
			if direction[0] == 1:
				# Right
				if self.posSpace % 4 == 0:
					return None
				if self.posSpace - 1 in self.posBigTile:
					newState = self.state[:]
					newState[self.posSpace] = self.state[self.posSpace - 1]
					newState[self.posSpace - 1] = self.state[self.posSpace - 2]
					newState[self.posSpace - 2] = self.state[self.posSpace]
					return State(newState, self)
				else:
					newState = self.state[:]
					newState[self.posSpace] = self.state[self.posSpace - 1]
					newState[self.posSpace - 1] = self.state[self.posSpace]
					return State(newState, self)
			else:
				# Left
				if self.posSpace % 4 == 3:
					return None
				if self.posSpace + 1 in self.posBigTile:
					newState = self.state[:]
					newState[self.posSpace] = self.state[self.posSpace + 1]
					newState[self.posSpace + 1] = self.state[self.posSpace + 2]
					newState[self.posSpace + 2] = self.state[self.posSpace]
					return State(newState, self)
				else:
					newState = self.state[:]
					newState[self.posSpace] = self.state[self.posSpace + 1]
					newState[self.posSpace + 1] = self.state[self.posSpace]
					return State(newState, self)

	def getHeuristicCost(self):
		cost = 0
		'''
		for i in range(0, 12):
			if self.state[i] != GOAL_STATE[i]:
				cost += 1
		'''
		for tile in self.state:
			tilePos = self.state.index(tile)
			goalPos = GOAL_STATE.index(tile)
			tilePosX = tilePos % 4
			goalPosX = goalPos % 4
			tilePosY = tilePos // 4
			goalPosY = goalPos // 4
			cost += abs(tilePosX - goalPosX) + abs(tilePosY - goalPosY)
		return cost

	def getNextStates(self):
		ans = []
		for direction in DIRECTIONS:
			hoge = self.getNextState(direction)
			if hoge is not None:
				ans.append(hoge)

		return ans

	def __gt__(self, other):
		return self.getHeuristicCost() > other.getHeuristicCost()
		#return self.depth > other.depth

	def __eq__(self, other):
		return self.state == other.state

	def __str__(self):
		i = 0
		ans = ''
		for s in self.state:
			ans += TILE_MAP[s]
			i += 1
			if i == 4 or i == 8:
				ans += '\n'
		return ans

def solve():
	reached = []
	scheduled = [State()]
	goal = None
	while True:
		scheduled.sort(reverse=True)
		currentState = scheduled.pop()
		if currentState in reached:
			hoge = reached.index(currentState)
			if currentState.depth < reached[hoge].depth:
				reached.remove(currentState)
				reached.append(currentState)
			continue
		reached.append(currentState)
		if currentState.getHeuristicCost() == 0:
			goal = currentState
			break
		for n in currentState.getNextStates():
			scheduled.append(n)
		'''
		print(currentState)
		print("depth :", currentState.depth, ", cost :", currentState.getHeuristicCost(),
		      ", reached :", len(reached), ", scheduled :", len(scheduled))
		#'''
		#sleep(0.5)

	ans = []
	curr = goal
	while True:
		if curr.prevState is None:
			break
		prev = reached[reached.index(curr.prevState)]
		for direction in DIRECTIONS:
			prev_next = prev.getNextState(direction)
			if prev_next is not None and prev_next == curr:
				ans.insert(0, DIRECTION_NAME[direction])
		curr = prev
	return ans


def solveWithAnswer(answer):
	state = State()
	for a in answer:
		print(state)
		print(a)
		direction = [k for k, v in DIRECTION_NAME.items() if v == a][0]
		state = state.getNextState(direction)

	print(state)

if __name__ == '__main__':
	ans = solve()

	print(''.join(ans))
	print("I DID IT!", len(ans), "moves")

	#solveWithAnswer(ans)
