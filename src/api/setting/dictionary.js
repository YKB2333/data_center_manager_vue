import http from '@/utils/http'
//获取字典列表
export function getDictionaryList(data) {
  return http.post('/common/dictionary/getDictionaryList/data-center', data)
}
//获取all字典列表
export function getAllDictionary() {
  return http.post('/common/dictionary/getAllDictionary/data-center')
}
//新增字典
export function saveDictionary(data) {
    return http.post('/common/dictionary/save/data-center', data)
}
//修改字典
export function updateDictionary(data) {
  return http.post('/common/dictionary/update/data-center', data)
}
  //删除
export function deleteDictionary(data) {
    return http.post('/common/dictionary/delete', data)
}