import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt,faXmark,faCirclePlus,faPlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { dbService, storageService } from "../../firebase_";
import '../../DetailStyle/ProjectDetail.css';
import React from "react";
import UploadAdapter from "../../components/UploadAdapter";
import TogetherDetailShow from "../../components/TogetherDetailShow";
 

const TogetherDetail = ({userObj, listObj}) => {	
	const location = useLocation();
	const nowProjectId = location.state.data;

	// 프로젝트 정보
	const [itemDetail, setItemDetail] = useState({
		id: "",
		title: "",
		member: [],
		tagList: [],
		data: "",
	});

	const [projectOwner, setProjectOwner] = useState(false);
	const [detailEditing, setDetailEditing] = useState(false);

	// 수정 프로젝트 정보
	const [newTitle, setNewTitle] = useState(null);
	const [newMemberName, setNewMemberName] = useState(null);		
	const [newMember, setNewMember] = useState(null);		
	const [newTagListName, setNewTagListName] = useState(null);		
	const [newTagList, setNewTagList] = useState(null);	

	const [newContent, setNewContent] = useState(null);
	

	// 해당 프로젝트 정보 가져오기
	useEffect(() => {
		dbService
		.collection("participateforms")
		.where("projectId", "==", nowProjectId)
		.get()
		.then(function(querySnapshot) {
			const newArray = querySnapshot.docs.map((document) => ({
				id: document.id,
				...document.data()
			}));

			// 현재 프로젝트 정보 저장
			setItemDetail({
				id: newArray[0].id,
				title: newArray[0].title,
				member: newArray[0].member,
				tagList: newArray[0].tagList,
				data: newArray[0].data,
			});

			setNewTitle(newArray[0].title);
			setNewMember([...newArray[0].member]);
			setNewTagList([...newArray[0].tagList]);
			setNewContent(newArray[0].data);

			dbService.doc(`participateforms/${itemDetail.id}`).update({
				view: newArray[0].view+1
			});
			
			// owner인지 확인
			if (newArray[0].creatorId == userObj.uid){
				setProjectOwner(true);
			}
			else{
				setProjectOwner(false);
			}
		})
		.catch(function(error) {
			console.log("Error getting documents: ", error);
		});
	}, []);

	// 프로젝트 삭제
	const onDeleteClick = async () => {
		const ok = window.confirm("삭제하시겠습니까?");

		if (ok){
			await dbService.doc(`participateforms/${itemDetail.id}`).delete();
			window.location.replace("/");
		}
	};

	// 수정
	const toggleEditing = () => setDetailEditing((prev) => !prev);

	// 수정 입력란
	const onChange = (event) => {
		const {
			target: {value}
		} = event;

		switch (event.target.id){
			case "inputTitle":
				setNewTitle(value);
				break;

			case "inputMember":
				setNewMemberName(value);
				break;

			case "inputTagList":
				setNewTagListName(value);
				break;
		}
	}

	// 멤버 추가
	const onAddMemberClick = () => {
		if (newMemberName !== ""){
			setNewMember([...newMember, newMemberName]);
			setNewMemberName("");
		}
	}

	// 멤버 삭제
	const onDeleteMember = (event) => {
		const newMemArray = newMember;
		newMemArray.splice(event.target.id, 1);
		setNewMember([...newMemArray]);
	}

	// 해시태그 추가
	const onAddTagListClick = () => {
		if (newTagListName !== ""){
			setNewTagList([...newTagList, newTagListName]);
			setNewTagListName("");
		}
	}

	// 해시태그 삭제
	const onDeleteTagList = (event) => {
		const newTagArray = newTagList;
		newTagArray.splice(event.target.id, 1);
		setNewTagList([...newTagArray]);
	}


	// 수정 취소
	const cancelEditing = () => {
		setNewTitle(itemDetail.title);
		setNewMember([...itemDetail.member]);
		setNewTagList([...itemDetail.tagList]);
		setNewContent(itemDetail.data);
		setDetailEditing((prev) => !prev);
	}

	function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadAdapter(loader, editor.t);
        }
    }

	// 수정 제출
	const onSubmit = async (event) => {
		event.preventDefault();

		
		// db 업데이트
		await dbService.doc(`participateforms/${itemDetail.id}`).update({
			title: newTitle,
			member: newMember,
			tagList: newTagList,
			data: newContent
		});

		// 프로젝트 정보 업데이트
		setItemDetail({
			id: itemDetail.id,
			title: newTitle,
			member: newMember,
			tagList: newTagList,
			data: newContent
		});

		setDetailEditing(false);
	};
		
	return (
		<div>

			{detailEditing ? (

				<div className="detail_container">
					<form onSubmit={onSubmit}>
								
						{/* Title */}
						<div className="list_update">
							<span>제목</span>
							<input
								onChange={onChange}
								value={newTitle}
								required
								placeholder="Edit Title"
								autoFocus
								id="inputTitle"
							/>
						</div>

						{/* Member */}
						<div  className="list_update">

							<span>
								멤버
								<div className="input_member">
									<input 
										type="text" 
										placeholder="Name"
										value={newMemberName}
										maxLength="15" 
										onChange={onChange}
										id="inputMember"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px", cursor:"pointer"}}
										onClick={onAddMemberClick}
									/>
								</div>
							</span>

							{newMember.map((memberName, index) => (
								<div className="member">
									{memberName}
									<FontAwesomeIcon id={index} onClick={onDeleteMember} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}}  />
								</div>
							))}
						</div>
						
						{/* tagList */}
						<div className="list_update">
							<span>
								해시태그
								<div className="input_hashtag">
									<input 
										type="text" 
										placeholder="Hashtag"
										value={newTagListName}
										maxLength="15" 
										onChange={onChange}
										id="inputTagList"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px", cursor:"pointer"}}
										onClick={onAddTagListClick}
									/>
								</div>
							</span>
							{newTagList.map((hashtag, index) => (
								<div className="hashtag">
									#{hashtag} 
									<FontAwesomeIcon id={index} onClick={onDeleteTagList} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}} />
								</div>
							))}
						</div>
						
						{/* Content */}
						<div className="list_update">
							<span>본문 내용</span>
							<CKEditor
								editor={ClassicEditor}
								data={newContent}
								
								config={{
									extraPlugins: [ MyCustomUploadAdapterPlugin],
								} }
								onInit={editor => {
									// You can store the "editor" and use when it is needed.
									console.log( 'Editor is ready to use!', editor );
								} }
								onChange={(event, editor) => {
									const data = editor.getData();
									setNewContent(data);
								}}
								onBlur={editor => {
									// console.log('Blur.', editor );
								} }
								onFocus={editor => {
									// console.log('Focus.', editor );
								} }
							/>
						</div>

						{/* update */}
						<input type="submit" value="Update Project" className="formBtn" />
					</form>

					{/* Cancel */}
					<div>
						<button onClick={cancelEditing} className="formBtn">Cancel</button>
					</div>
				</div >

			) : (
				<div className="detail_container">

					<TogetherDetailShow itemDetail={itemDetail} />
					
					{projectOwner && (
						<div style={{ paddingBottom:"20px"}}>
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} size="2x" style={{ padding:"10px"}}/>
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} size="2x" style={{ padding:"10px"}}/>
							</span>
						</div>
					)}
				
				</div >
			)}
		</div>
	);
};

export default TogetherDetail;
