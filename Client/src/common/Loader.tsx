import { CircularProgress, Stack } from '@mui/material'

const Loader = ({minHeight}:{minHeight? :string}) => {
  return (
    <Stack width={"100%"} height={"100%"} alignItems={"center"} justifyContent={"center"} minHeight={minHeight??"100vh"}>
        <CircularProgress/>
    </Stack>
  )
}

export default Loader
