import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { toggleNode, setShowInput, setShowRenameInput, updateRenameValue } from '../store/slices/uiSlice'
import { selectIsNodeExpanded, selectShowInput, selectShowRenameInput } from '../store/selectors'

interface ExplorerProps {
    data: any;
    handleInsertNode: any;
    handleUpdateNode: any;
    handleDeleteNode: any;
}

const Explorer = ({ data, handleInsertNode, handleUpdateNode, handleDeleteNode }: ExplorerProps) => {
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => selectIsNodeExpanded(state, data.id))
    const showInput = useAppSelector((state) => selectShowInput(state, data.id))
    const showRenameInput = useAppSelector((state) => selectShowRenameInput(state, data.id))
    const handleAdd = (e: any, isFolder: any) => {
        e.stopPropagation()
        dispatch(toggleNode({ nodeId: data.id }))
        dispatch(setShowInput({ nodeId: data.id, visible: true, isFolder }))
    }
    const onAddFolder = (e: any) => {
        if (e.keyCode === 13 && e.target.value) {
            handleInsertNode(data.id, e.target.value, showInput.isFolder)
            dispatch(setShowInput({ nodeId: data.id, visible: false, isFolder: null }))
        }
    }

    const handleRename = (e: any) => {
        e.stopPropagation()
        dispatch(setShowRenameInput({ nodeId: data.id, visible: true, value: data.name }))
    }

    const onRename = (e: any) => {
        if (e.keyCode === 13 && e.target.value) {
            handleUpdateNode(data.id, e.target.value)
            dispatch(setShowRenameInput({ nodeId: data.id, visible: false, value: '' }))
        }
    }

    const handleDelete = (e: any) => {
        e.stopPropagation()
        if (window.confirm(`Are you sure you want to delete "${data.name}"?`)) {
            handleDeleteNode(data.id)
        }
    }
    if (data.isFolder) {
        return (
            <div className='mt-5 ml-5'>
                <div onClick={() => {
                    dispatch(toggleNode({ nodeId: data.id }))
                    dispatch(setShowInput({ nodeId: data.id, visible: false, isFolder: null }))
                }
                } className='flex space-between'>
                    {showRenameInput.visible ? (
                        <input 
                            type='text' 
                            className='border border-blue-400' 
                            value={showRenameInput.value}
                            onChange={(e) => dispatch(updateRenameValue({ nodeId: data.id, value: e.target.value }))}
                            autoFocus 
                            onBlur={() => dispatch(setShowRenameInput({ nodeId: data.id, visible: false, value: '' }))} 
                            onKeyDown={(e) => onRename(e)} 
                        />
                    ) : (
                        <span className=' text-gray-500 cursor-pointer' onDoubleClick={handleRename}>🗂️{data.name}</span>
                    )}
                    <div>
                        <button onClick={(e) => handleAdd(e, true)}>Folder +</button>
                        <button onClick={(e) => handleAdd(e, false)}>File +</button>
                        <button onClick={handleRename}>Rename</button>
                        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">Delete</button>
                    </div>
                </div>
                <div className={`${isOpen ? 'block' : 'hidden'} flex flex-col gap-2`}>
                    {
                        showInput.visible && (
                            <div>
                                <span> {showInput.isFolder ? "🗂️" : "🗃️"}</span>
                                <input type='text' className='border border-blue-400' autoFocus onBlur={() => dispatch(setShowInput({ nodeId: data.id, visible: false, isFolder: null }))} onKeyDown={(e) => onAddFolder(e)} />
                            </div>
                        )
                    }
                    {data.items.map((item: any) => (
                        <span key={item.id} className='text-sm text-gray-500 ml-4'><Explorer handleInsertNode={handleInsertNode} handleUpdateNode={handleUpdateNode} handleDeleteNode={handleDeleteNode} data={item} /></span>
                    ))}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className=' ml-5 mt-5'>
                <div className='flex space-between'>
                    {showRenameInput.visible ? (
                        <input 
                            type='text' 
                            className='border border-blue-400' 
                            value={showRenameInput.value}
                            onChange={(e) => dispatch(updateRenameValue({ nodeId: data.id, value: e.target.value }))}
                            autoFocus 
                            onBlur={() => dispatch(setShowRenameInput({ nodeId: data.id, visible: false, value: '' }))} 
                            onKeyDown={(e) => onRename(e)} 
                        />
                    ) : (
                        <span className='text-sm text-gray-500 cursor-pointer' onDoubleClick={handleRename}>🗃️{data.name}</span>
                    )}
                    <div>
                        <button onClick={handleRename}>Rename</button>
                        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Explorer