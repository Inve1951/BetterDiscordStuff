//META{"name":"shake4ever"}*//

shake4ever = (function(){
	var shaker, animProps;

	return class shake4ever {
		getName(){return"shake4ever"}
		getAuthor(){return"square"}
		getVersion(){return"1.1.1"}
		getDescription(){return"Shakes the app with no end."}

		load(){}

		start() {
			shaker = BDV2.getInternalInstance(document.querySelector(".app")).return.stateNode;

			animProps = {
				duration: Infinity,
				intensity: 5
			};

			Object.defineProperty(shaker, "animProps", {
				get: () => animProps,
				set: newProps => {
					if( newProps instanceof Object )
						for(let prop in newProps) if( "duration" !== prop && "intensity" !== prop )
							animProps[prop] = newProps[prop];
					return true;
				},
				configurable: true
			});
			shaker.shake(0, 0);
		}

		stop() {
			if( shaker != null ) {
				delete shaker.animProps;
				shaker.animProps = animProps;
				shaker.stop();
				shaker = null;
			}
		}
	}
})()
