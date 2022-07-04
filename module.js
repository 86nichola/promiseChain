
export const start = (option) => {

	console.log("=== type [ start Assistant ] : location[ start ]");

	// 시작여부 체크
	if (privateFn.__assistantCanStart() == false) {
		throw new Error("start assistant request is denied.");
	};

	_isStart = true;
	var pageContext = this;

	assistantStart.call(pageContext)
		.then(function (result) {
			console.log("=== type [ assistantStart promiseChain then ] : location[ assistantStart ]");
			
			// var response = {
			// 	msg: privateFn.__getSuccessMessage() || result || "",
			// 	result: privateFn.__getTemp("callLocalAssistantSuccess") || result || {}
			// }

			// //종료 시점 성공콜백 실행
			// var customCallback = _assistantOption.customCallback;
			// customCallback && customCallback.success && customCallback.success.call(this, response);
			// _assistantOption.info.executeAssistantSuccess && _assistantOption.info.executeAssistantSuccess.call(this, response);

		}.bind(pageContext))
		.catch(function (e) {

			// console.log("=== type [ assistantStart promiseChain catch ] : location[ assistantStart ]");
			// console.log(e);
			// privateFn.__canCreateErrorAlert(e) && privateFn.__createErrorAlert.call(this, e);
			// // assi버전체크중인 경우 아래로직 안타도록 처리
			// if (e.waitForInsatall && privateFn.__getVersionCheckEnd() === false) {
			// 	return;
			// }

			// var response = {
			// 	msg: e.Error || e || "",
			// 	result: privateFn.__getTemp("callLocalAssistantError") || e || {}
			// }

			// //종료 시점 실패 콜백 실행
			// var customCallback = _assistantOption.customCallback;
			// customCallback && customCallback.fail && customCallback.fail.call(this, response);
			// _assistantOption.info.executeAssistantFail && _assistantOption.info.executeAssistantFail.call(this, response);
			// // 프로그레스바 처리
			// privateFn.__hideProgressbar.call(this);

		}.bind(pageContext))
		.finally(function () {
			console.log("=== type [ assistantStart promiseChain finally ] : location[ assistantStart ]");
	
			// _isStart = false;

			// // assi버전체크중인 경우 아래로직 안타도록 처리
			// if (privateFn.__getVersionCheckEnd() == false) {
			// 	return;
			// }
			// // 프로그레스바 처리
			// privateFn.__hideProgressbar.call(this);

			console.log("=== type [ end Assistant ] : location[ start ]");
		}.bind(pageContext));


	//assistantStart first Promise Function.
	function assistantStart() {
		return new Promise(function (resolve, reject) {

			var steps = ecmodule.assistant.promiseChain({ resolveFn: resolve, rejectFn: reject, locationMemo: "assistantStart" });
			// steps
			// 	.addPromise({ name: "assistantStart __preExecute", fn: privateFn.__preExecute.bind(this) })
			// 	.addPromise({ name: "assistantStart __execute", fn: privateFn.__execute.bind(this) })
			// 	.addPromise({ name: "assistantStart __onExecuted", fn: privateFn.__onExecuted.bind(this) })
			// 	.reducePromise();

		}.bind(pageContext))
	}

}

   
export default promiseChain = () => {
	return {
		/**
			*  create new Promise Chain
			*  ==> this function must in new Promise parameter Function
			*      new Promise(function(resolve, reject){  // here   })
			*  ==> if parameter have no resolve,reject callback then page source need attach after .reducePromise() + then().catch() 
			*
			*  (parameter)
			*  createOption
			*  {
			*		resolveFn: resolve callback function  
			*		rejectFn: reject callback function			
			*		
			*		useCustomList(boolean) : use parameter Function list
			*		fnList(Array) : function list by return Promiseobject
			*		   // [ function(){return new Promise(resolve,reject){...}}, { function...} , {... }]
			*  }
			*  
			*  (sample)
			*  var steps = ecmodule.assistant.promiseChain({ resolveFn: resolve, rejectFn: reject, locationMemo: "__defaultExecuteFlow preExecute" });
			*	steps
			*		.addPromise({ name: "name", fn: function () { return new Promise(function (resolve, reject) { resolve(); }) } })
			*		.addPromise({ name: "name", fn: function () { }.bind(this, parameter)) // function called prev then. ex) fn(parameter, resolve, reject) 
			*		.reducePromise();
			*/
		promiseChain: function (createOption) {

			var _fnList = [];
			var _option = createOption || {};

			return {
				/**
				 * 
				 */
				init: function () {
					_fnList = [];
					return this;
				},
				/**
				 *  option
				 *  {
				 *		addFilter(boolean): filter
				 *		name(string) : name,
				 *		fn(function) : 
				 *			// function(){return new Promise(resolve,reject){...}}
				 *	}
				 */
				addPromise: function (options) {
					var option = options || {};
					var fnName = option.name || "noName";
					var filter = option.addFilter;

					var PromiseFn = option.fn;
					if (typeof PromiseFn != "function") {
						throw new Error("required fn");
					}
					// addFilter false 체크 후 목록추가 안함(분기처리역활)
					if (filter === false) {
						console.log(String.format("filtered fn: {0} ", option.name));
						return this;
					}

					// 프로미스객체 반환함수 추가
					_fnList.push({ name: fnName, fn: PromiseFn });
					return this;
				},
				/**
				 * reducePromise
				 */
				reducePromise: function () {
					// fn Array로 변환
					var promiseFnList = _fnList.map(function (item) { return item.fn }) || [];
					var lastResolve = _option.resolveFn;
					var lastReject = _option.rejectFn;
					var logger = function (type) {
						console.log(String.format("=== type [ {0} ] : location[ {1} ]/ time [ {2} ]=== ", type, _option.locationMemo || "unknown", new Date().format("yyyy-MM-ddThh:MM:ss")));
					};
					// 파라미터옵션의 fn Array 기준 동작여부 체크
					if (_option.useCustomList) {
						promiseFnList = _option.fnList;
					}

					// // validate
					// if (promiseFnList.length == 0) {
					//     throw new Error("Promise Functions is Empty.");
					// }

					logger("reducePromise start");
					var reducePromise = _.reduce(promiseFnList, function (prevPromise, fn, idx, array) {
						return prevPromise.then(fn);
					}, Promise.resolve());

					reducePromise
						.then(function (result) {
							logger("last promiseChain then");
							return lastResolve && lastResolve(result) || result;

						})
						.catch(function (e) {
							// 중첩으로 promise일때
							logger("last promiseChain catch");
							return lastReject && lastReject(e) || e;

						})
						.finally(function () {
							logger("last promiseChain finally");
						});

					return reducePromise;

				}
			}
		},
	}
}

