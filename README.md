﻿# promiseChain


-요약 
promise 와 then 연결을 사용할때 then을 누적해서 호출과 이행이 한 플로우에 끝나는 경우가 아닐때

배열에 프로미스 함수를 담고 각각의 배열 A , 배열 B 가 서로 연결되도록 
배열 A의 resolve 를 배열 B가 종료될때 호출합니다.

preExecute
execute
onExecuted 

3단계로 promise객체반환 함수를 담고 해당 구조안에 비동기함수들을 순차적으로 사용할 수 있습니다.
콜백이 깊어지는 대신 플랫한 구조로 배열을 이용해 가독성을 높이고 함수형으로 구조를 만드는 경우 더 효과적입니다.




