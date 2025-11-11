# Interval Split 👋

## 1. Main 화면

- 시작 버튼
- 하단 탭 내비게이션

## 2. 기능 명세

   IntervalBlock {
      tag: 'warmUp' | 'workOut' | 'coolDown'
      time: number,
      pace: number,
   }

### 2-1 데이터 정의

   인터벌 세트(IntervalSet)
      IntervalSet {
         warmUp: IntervalBlock
         workOut: IntervalBlock[]
         coolDown: IntervalBlock
      }
      - tag, time, pace
      - 시작(warming up)
         - 워밍업의 횟수는 1회이다
         - tag, time
      - 프로그램
         - 프로그램의 횟수는 제한이 없다 (workOut field에서 배열의 갯수 추가 계속 할 수 있음)
         - tag, time, round
      - 쿨다운
         - 쿨다운의 횟수는 1회이다.
         - tag, time
      시나리오
      1. 최초 생성 시 IntervalSet로 생성
      2. UI에서 시작과 쿨다운은 tag 수정 불가능
      3. 프로그램 라벨 옆에는 + 버튼이 있어서 Block 추가 가능
      4. 저장하면 AsyncStorage에 저장
   인터벌 프로그램(IVProgram)
      프로그램의 템플릿
      IVProgram {
         workOuts: IntervalSet[],
         startDate: Date,
         endDate: Date,
         period: number,
      }
      미리 제공하는 프로그램
         - 초보 (1달 세션)
         - 중간 (2주 세션)
      자율 등록

### 2-2 화면 정의

2-2-1 메인

- 로고
- 시작하기(Run)
- 프로그램(프로그램 만들기 & 수정하기)

2-2-2 프로그램 짜기

- 시작 설정
- workout 설정
- cool down 설정

2-2-3 인터벌 프로그램

- 초보(1달) -> JSON으로 미리 Sheet 작성
- 중수(1달) -> JSON으로 미리 Sheet 작성
