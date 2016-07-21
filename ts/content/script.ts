module App {
	declare var chrome:any;

	const ADD_BUTTON_CLASS = 'add-button';
	const ADD_BUTTON_CLASS_SHOW = 'add-button--show';
	let doc:Document = document;

	// 初期化
	export function initialize():void{
		console.log('【INITIAlIZE】');
		setFocusEvent();
	}
	// 追加ボタンを見せる
	function showAddButton(addButton:HTMLElement):void {
		addButton.classList.add(ADD_BUTTON_CLASS_SHOW);
	}
	// 追加ボタンを隠す
	function hideAddButton(addButton:HTMLElement):void {
		addButton.classList.remove(ADD_BUTTON_CLASS_SHOW);
	}
	// 追加ボタンをすべて隠す
	function hideAddButtonAll():void {
		const addButtons = <NodeListOf<HTMLElement>>doc.querySelectorAll(`.${ADD_BUTTON_CLASS_SHOW}`);
		for(let i = 0, len = addButtons.length; i < len; ++i) {
			hideAddButton(addButtons[i]);
		}
	}
	function addButtonStopPropagation(e:MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		// App.autocomplete.dialog.selectItem($(this).index('.qt-item'));
		// if (e.type === 'mousedown') {
		// 	App.autocomplete.dialog.selectActive();
		// 	//App.autocomplete.dialog.close();
		// }
	} 
	// 追加ボタンクリック
	function addButtonClickEvent(e:MouseEvent):void {
		copyImage();
		// クリップボード貼り付け
		doc.execCommand('paste');
	}

	function copyImage():void {
		const TEXT_AREA_ID = 'tempTextArea';
		const textArea = doc.createElement('textarea');
		textArea.id = TEXT_AREA_ID;
		textArea.style.cssText = 'position:absolute;left:-100%;opacity:0;';

		doc.body.appendChild(textArea);

		textArea.value = 'ほえほえーーー';
		textArea.select();
		doc.execCommand("copy");
	}
	// focusinイベント
	function focusInEvent(e:MouseEvent):void {
		const elem = <HTMLElement>e.target;
		const isShowButton = getButtonDisplay(elem);
		const closestElem = Util.closest(elem, 'td');
		if(isShowButton && closestElem !== null) {
			let button = <HTMLElement>closestElem.querySelector(`.${ADD_BUTTON_CLASS}`);
			if(button === null) {
				button = createAddButton();
				closestElem.appendChild(button);
			}
			showAddButton(button);
		}
	}
	// focusoutイベント
	function focusOutEvent(e:MouseEvent):void {
		hideAddButtonAll();
	}
	// 追加ボタン作成
	function createAddButton():HTMLElement {
		const addButton:HTMLElement  = doc.createElement('div');
		addButton.innerText = '追加';
		addButton.classList.add(ADD_BUTTON_CLASS);
		addButton.addEventListener('mouseup', addButtonClickEvent, false);
		addButton.addEventListener('mouseover mousedown', addButtonStopPropagation, false);
		return addButton;
	}
	// focus系イベント設定
	function setFocusEvent() {
		doc.addEventListener('focusin', focusInEvent, true);
		doc.addEventListener('focusout', focusOutEvent, true);
	}
	// addButtonを表示するかどうかの取得
	function getButtonDisplay(elem:HTMLElement):boolean {
		let isShowButton = false;
		if(
			elem.tagName === 'textarea' ||
			(elem.tagName === 'input' && elem.attributes['type'] === 'text') ||
			elem.hasAttribute('contenteditable')
		) {
			isShowButton = true;
		}
		return isShowButton;
	}
}

namespace Util {
	// closestの代替
	export function closest(elem:HTMLElement, selector:string):HTMLElement {
		const matchesSelector = elem.matches || elem.webkitMatchesSelector;
		while (elem) {
			if (matchesSelector.call(elem, selector)) {
				return elem;
			} else {
				elem = elem.parentElement;
			}
		}
		return null;
	}
}
App.initialize();
