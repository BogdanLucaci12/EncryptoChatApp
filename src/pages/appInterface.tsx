import { FlexibleContainer } from "../components/helperComponent/container.styles"
import LeftComponent from "../components/aboutUser/LeftComponent.component"
import RightComponent from "../components/rightComponent/RightComponent.component"

const AppInterface = () => {
    return (
        <FlexibleContainer className="bg-zinc-300">
           <LeftComponent/>
           <RightComponent/>
        </FlexibleContainer>
    )
}
export default AppInterface
